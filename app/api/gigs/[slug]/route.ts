import { authOptions } from "@/utils/authOptions";
import { EditGigArgs } from "@/domain/Gig/Gig.webService";
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
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { Prisma } from "@prisma/client";
import { deleteGigImage, downloadAndStoreImage } from "@/app/api/utils/image";
import {
  flattenGigBands,
  gigWithBandsAndGenresInclude,
} from "@/app/api/utils/gigs";
import { invalidImageUrlError } from "@/domain/Gig/errors";
import { removeParametersFromUrl } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import dayjs from "@/lib/dayjs";

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
  const body = (await request.json()) as EditGigArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
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
        const createdBand = await prisma.band.create({
          data: {
            isLocal: band.isLocal,
            genres: { connect: band.genres.map((g) => ({ id: g })) },
            name: band.name,
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
    let newImageUrl: string | undefined = prevImageUrl ?? undefined;
    const hasImageChanged = imageUrl && imageUrl !== prevImageUrl;
    if (hasImageChanged) {
      newImageUrl = await downloadAndStoreImage({
        filename: slug,
        imageFormat: IMG_OUTPUT_FORMAT,
        imageUrl: imageUrl,
        resizeOptions: {
          fit: "fill",
          height: IMG_MAX_HEIGHT,
          width: IMG_MAX_WIDTH,
        },
      });
    }
    const updatedGig = await prisma.gig.update({
      where: { id: body.id },
      data: Prisma.validator<Prisma.GigUpdateInput>()({
        ...bodyWithoutPlaceIdAndAuthorId,
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
        imageUrl: newImageUrl,
        slug: slug,
        place: { connect: { id: body.placeId } },
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
