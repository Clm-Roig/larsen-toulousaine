import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import { CreateGigArgs } from "@/domain/Gig/Gig.webService";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import {
  IMG_MAX_HEIGHT,
  IMG_MAX_WIDTH,
  IMG_OUTPUT_FORMAT,
} from "@/domain/Gig/constants";
import { downloadAndStoreImage } from "@/app/api/utils/image";
import { getConflictingBandNameError } from "@/domain/Band/errors";
import { gigListOrderBy } from "@/app/api/utils/gigs";
import { invalidImageUrlError } from "@/domain/Gig/errors";

const defaultInclude = {
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
};

export async function GET(request: NextRequest) {
  const { user } = (await getServerSession(authOptions)) || {};
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const query = searchParams.get("query");
  const placeId = searchParams.get("placeId");
  const date = searchParams.get("date");
  let byDateAndPlaceGig, gigs;

  // Search gigs
  if (query) {
    const rawGigs = await prisma.gig.findMany({
      where: {
        OR: [
          {
            bands: {
              some: {
                band: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
          {
            place: {
              ...(!user ? { isSafe: true } : {}),
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: defaultInclude,
      orderBy: [
        { date: Prisma.SortOrder.desc },
        ...gigListOrderBy.filter((obj) => !obj.date),
      ],
      take: 10,
    });
    gigs = rawGigs.map((gig) => ({
      ...gig,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
    }));
    return NextResponse.json({
      gigs: gigs,
    });
  }

  // Get a gig list
  if (from && to) {
    const rawGigs = await prisma.gig.findMany({
      where: {
        date: {
          gte: from
            ? new Date(from)
            : dayjs(new Date()).startOf("month").toDate(),
          lte: to ? new Date(to) : dayjs(new Date()).endOf("month").toDate(),
        },
        place: { ...(!user ? { isSafe: true } : {}) },
      },
      include: defaultInclude,
      orderBy: gigListOrderBy,
    });
    gigs = rawGigs.map((gig) => ({
      ...gig,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
    }));
    return NextResponse.json({
      gigs: gigs,
    });
  }

  // Search a gig by date and place
  if (placeId || date) {
    const whereClause = {
      ...(date
        ? {
            date: {
              gte: dayjs(date).startOf("day").toDate(),
              lte: dayjs(date).endOf("day").toDate(),
            },
          }
        : {}),
      ...(placeId ? { placeId: placeId } : {}),
    };
    const rawGig = await prisma.gig.findFirst({
      where: whereClause,
      include: defaultInclude,
      orderBy: gigListOrderBy,
    });
    if (!rawGig) {
      return NextResponse.json({}, { status: 404 });
    }
    byDateAndPlaceGig = {
      ...rawGig,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
      bands: rawGig.bands.map((b) => ({ ...b.band, order: b.order })),
    };
    return NextResponse.json(byDateAndPlaceGig);
  }

  return NextResponse.json(
    {
      message:
        'Bad request, you must specify some criterias too find gigs (date "from" and "to", or "placeId" and "date").',
    },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreateGigArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { bands, imageUrl } = body;
  let causingErrorBand;
  try {
    // Create inexisting bands
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        causingErrorBand = band;
        const createdBand = await prisma.band.create({
          data: {
            name: band.name,
            genres: { connect: band.genres.map((g) => ({ id: g })) },
          },
        });
        return { ...createdBand, order: band.order };
      }),
    );
    const toConnectBands = bands.filter((b) => b.id);
    const slug = computeGigSlug({ bands: bands, date: body.date });

    let blobImageUrl: string | undefined = undefined;
    if (imageUrl) {
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
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeId, ...bodyWithoutPlaceId } = body;
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...bodyWithoutPlaceId,
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
    return NextResponse.json(createdGig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const { meta } = error;
        if ((meta?.target as string[])?.includes("name") && causingErrorBand) {
          return toResponse(getConflictingBandNameError(causingErrorBand.name));
        } else {
          return NextResponse.json(
            {
              message: "There is a conflict with another gig.",
              frMessage: "Il y a un conflit avec un autre concert.",
            },
            { status: 409 },
          );
        }
      }
    }
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
