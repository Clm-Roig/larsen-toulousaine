import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { removeParametersFromUrl } from "@/utils/utils";
import { downloadAndStoreImage } from "@/app/api/utils/image";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import {
  IMG_MAX_HEIGHT,
  IMG_MAX_WIDTH,
  IMG_OUTPUT_FORMAT,
} from "@/domain/Gig/constants";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import { CreateGigArgs } from "@/domain/Gig/Gig.webService";
import { revalidatePath } from "next/cache";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { invalidImageUrlError } from "@/domain/Gig/errors";
import dayjs from "@/lib/dayjs";
import { validateCountryAndRegionCodes } from "@/app/api/utils/bands";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";

async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateGigArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { bands, imageUrl } = body;
  try {
    // Create inexisting bands
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const { city, countryCode, genres, isLocal, name, regionCode, order } =
          band;
        const validationMsg = validateCountryAndRegionCodes(
          countryCode,
          regionCode,
        );
        if (validationMsg) {
          throw new Error(`Bad request for the band ${name}. ${validationMsg}`);
        }
        const createdBand = await prisma.band.create({
          data: {
            city: city,
            countryCode: isLocal ? LOCAL_COUNTRY_CODE : countryCode,
            genres: { connect: genres.map((g) => ({ id: g })) },
            isLocal: isLocal,
            name: name,
            regionCode: isLocal ? LOCAL_REGION_CODE : regionCode,
          },
        });
        return { ...createdBand, order: order };
      }),
    );
    const toConnectBands = bands.filter((b) => b.id);
    const slug = computeGigSlug({
      bands: bands,
      date: body.date,
      name: body.name,
    });

    let blobImageUrl: string | undefined = undefined;
    if (imageUrl) {
      try {
        blobImageUrl = await downloadAndStoreImage({
          filename: slug,
          imageFormat: IMG_OUTPUT_FORMAT,
          imageUrl: imageUrl,
          resizeOptions: {
            height: IMG_MAX_HEIGHT,
            width: IMG_MAX_WIDTH,
            withoutEnlargement: true,
          },
        });
      } catch (error) {
        return NextResponse.json(
          {
            message: `An unexpected error occured when trying to download the gig poster: ${error.message}`,
          },
          { status: 500 },
        );
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeId, facebookEventUrl, ...bodyWithoutPlaceId } = body;
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...bodyWithoutPlaceId,
        // endDate must be different than date
        endDate: dayjs(body.endDate).isSame(dayjs(body.date))
          ? null
          : body.endDate,
        facebookEventUrl: facebookEventUrl
          ? removeParametersFromUrl(facebookEventUrl)
          : null,
        ticketReservationLink: body.hasTicketReservationLink
          ? body.ticketReservationLink
          : null,
        bands: {
          create: [...toConnectBands, ...createdBands].map((band) => ({
            band: {
              connect: {
                id: band.id,
              },
            },
            order: band.order,
          })),
        },
        imageUrl: blobImageUrl,
        author: { connect: { id: user.id } },
        slug: slug,
        place: { connect: { id: body.placeId } },
      }),
      include: { bands: true },
    });
    if (createdBands?.length > 0) {
      revalidatePath("bands");
    }
    return NextResponse.json(createdGig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message: "There is a conflict with another gig.",
            frMessage: "Il y a un conflit avec un autre concert.",
          },
          { status: 409 },
        );
      }
    }
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message: `There was an error with your data when trying to create a gig: ${error.message}`,
        },
        { status: 400 },
      );
    }
    if (error.name === invalidImageUrlError.name) {
      return toResponse(error);
    }
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}

export default POST;
