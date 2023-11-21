import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  const { idOrSlug: rawIdOrSlug } = params;
  const idOrSlug = decodeURIComponent(rawIdOrSlug);
  const gig = await prisma.gig.findFirst({
    where: {
      OR: [
        {
          id: {
            equals: idOrSlug,
          },
        },
        {
          slug: {
            equals: idOrSlug,
          },
        },
      ],
    },
    include: {
      author: true,
      place: true,
      bands: {
        include: {
          band: {
            include: {
              genres: true,
            },
          },
        },
      },
    },
  });
  const cleanedGig = {
    ...gig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    bands: gig?.bands.map((b) => ({ ...b.band, order: b.order })),
  };
  return NextResponse.json(cleanedGig);
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
  const prevImageUrl = previousGig?.imageUrl;
  let blobImageUrl: string | undefined = prevImageUrl ?? undefined;
  const hasImageChanged = imageUrl && imageUrl !== prevImageUrl;
  try {
    // Create inexisting bands
    const toConnectBands = bands.filter((b) => b.id);
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const createdBand = await prisma.band.create({
          data: {
            name: band.name,
            genres: { connect: band.genres.map((g) => ({ id: g })) },
          },
        });
        return { ...createdBand, order: band.order };
      }),
    );

    // Delete previous band <-> gig relationship
    await prisma.bandsOnGigs.deleteMany({ where: { gigId: body.id } });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeId, authorId, ...bodyWithoutPlaceIdAndAuthorId } = body;
    const slug = computeGigSlug({ bands: bands, date: body.date });

    if (hasImageChanged) {
      blobImageUrl = await downloadAndStoreImage({
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
    const createdGig = await prisma.gig.update({
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
        imageUrl: blobImageUrl,
        author: { connect: { id: user.id } },
        slug: slug,
        place: { connect: { id: body.placeId } },
      }),
      include: { bands: true },
    });

    if (hasImageChanged && prevImageUrl) {
      try {
        await deleteGigImage(prevImageUrl);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
      }
    }

    return NextResponse.json(createdGig);
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
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  const { idOrSlug: rawIdOrSlug } = params;
  const idOrSlug = decodeURIComponent(rawIdOrSlug);
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    const toBeDeletedGigs = await prisma.gig.findMany({
      where: {
        OR: [
          {
            id: {
              equals: idOrSlug,
            },
          },
          {
            slug: {
              equals: idOrSlug,
            },
          },
        ],
      },
    });
    await prisma.gig.deleteMany({
      where: {
        OR: [
          {
            id: {
              equals: idOrSlug,
            },
          },
          {
            slug: {
              equals: idOrSlug,
            },
          },
        ],
      },
    });
    await Promise.all(
      toBeDeletedGigs.map(async (gig) => {
        await deleteGigImage(gig.imageUrl);
      }),
    );
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
