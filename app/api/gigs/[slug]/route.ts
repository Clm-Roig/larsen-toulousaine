import { authOptions } from "@/utils/authOptions";
import { EditGigArgs } from "@/domain/Gig/Gig.webService";
import { IMG_OUTPUT_FORMAT } from "@/domain/Gig/constants";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { Prisma } from "@prisma/client";
import {
  deleteGigImage,
  downloadImage,
  storeImage,
} from "@/app/api/utils/image";
import {
  flattenGigBands,
  gigWithBandsAndGenresInclude,
} from "@/app/api/utils/gigs";
import {
  invalidImageUrlError,
  tooBigImageFileError,
} from "@/domain/Gig/errors";
import { removeParametersFromUrl } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import dayjs from "@/lib/dayjs";
import { MAX_IMAGE_SIZE } from "@/domain/image";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug: rawSlug } = params;
  const slug = decodeURIComponent(rawSlug);
  const gig = await prisma.gig.findFirst({
    where: {
      slug: slug,
    },
    include: gigWithBandsAndGenresInclude,
  });
  if (!gig) {
    return new Response(null, { status: 404 });
  }
  const flattenedGig = flattenGigBands(gig);
  return NextResponse.json(flattenedGig);
}

export async function PUT(request: NextRequest) {
  // Check auth
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  // Parse formData
  const formData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawData: { data: any } = { data: null };
  formData.forEach((value, key) => (rawData[key] = value));
  const body: EditGigArgs = JSON.parse(rawData.data);

  // Check body and file
  if (!body) {
    return toResponse(missingBodyError);
  }
  const imageFile = formData.get("file") as unknown as File;
  if (imageFile && imageFile?.size > MAX_IMAGE_SIZE) {
    return toResponse(tooBigImageFileError);
  }

  const { bands, id, imageUrl } = body;
  const previousGig = await prisma.gig.findFirst({
    where: { id: id },
    include: {
      bands: {
        include: {
          band: {
            include: {
              gigs: true,
            },
          },
        },
      },
    },
  });
  try {
    // Create inexisting bands
    const toConnectBands = bands.filter((b) => b.id);
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const {
          city,
          countryCode,
          genres,
          isATribute,
          isLocal,
          isSafe,
          name,
          regionCode,
        } = band;
        const createdBand = await prisma.band.create({
          data: {
            city: city,
            countryCode: countryCode,
            genres: { connect: genres.map((g) => ({ id: g })) },
            isATribute: isATribute,
            isLocal: isLocal,
            isSafe: isSafe,
            name: name,
            regionCode: regionCode,
          },
        });
        return { ...createdBand, order: band.order };
      }),
    );

    // Delete previous band <-> gig relationship
    await prisma.bandsOnGigs.deleteMany({ where: { gigId: body.id } });

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      placeId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorId,
      facebookEventUrl,
      ...bodyWithoutPlaceIdAndAuthorId
    } = body;
    const slug = computeGigSlug({
      bands: bands,
      date: body.date,
      name: body.name,
    });

    const prevImageUrl = previousGig?.imageUrl;
    let newImageUrl: string | null =
      !imageFile && !imageUrl ? null : prevImageUrl ? prevImageUrl : null;
    const hasImageChanged =
      !!imageFile || (imageUrl && imageUrl !== prevImageUrl); // if an imageFile is sent, it's to change it
    if (hasImageChanged) {
      const arrayBufferImg = imageUrl
        ? await downloadImage(imageUrl)
        : await imageFile.arrayBuffer();
      newImageUrl = await storeImage({
        arrayBufferImg,
        filename: slug,
        imageFormat: IMG_OUTPUT_FORMAT,
      });
    }
    if (!newImageUrl && prevImageUrl) {
      await deleteGigImage(prevImageUrl);
    }
    const updatedGig = await prisma.gig.update({
      where: { id: body.id },
      data: Prisma.validator<Prisma.GigUpdateInput>()({
        ...bodyWithoutPlaceIdAndAuthorId,
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
        // endDate must be different than date
        endDate: dayjs(body.endDate).isSame(dayjs(body.date))
          ? null
          : body.endDate,
        facebookEventUrl: facebookEventUrl
          ? removeParametersFromUrl(facebookEventUrl)
          : null,
        imageUrl: newImageUrl,
        isAcceptingBankCard: body.isAcceptingBankCard
          ? body.isAcceptingBankCard
          : null,
        place: { connect: { id: body.placeId } },
        slug: slug,
        ticketReservationLink: body.hasTicketReservationLink
          ? body.ticketReservationLink
          : null,
      }),
      include: { bands: true },
    });
    if (createdBands?.length > 0) {
      revalidatePath("bands");
    }
    return NextResponse.json(updatedGig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to create a gig.",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug: rawSlug } = params;
  const slug = decodeURIComponent(rawSlug);
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    const toBeDeletedGig = await prisma.gig.findFirst({
      where: {
        slug: slug,
      },
    });
    await prisma.gig.delete({
      where: {
        slug: slug,
      },
    });
    if (toBeDeletedGig) {
      await deleteGigImage(toBeDeletedGig.imageUrl);
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete a gig.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}
