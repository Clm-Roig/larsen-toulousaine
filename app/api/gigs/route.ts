import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { put as blobPut } from "@vercel/blob";
import sharp from "sharp";
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

const IMG_OUTPUT_FORMAT = "jpg";
const IMG_MAX_WIDTH = 800;
const IMG_MAX_HEIGHT = Math.round((IMG_MAX_WIDTH * 9) / 16);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const gigs = await prisma.gig.findMany({
    where: {
      date: {
        gte: from
          ? new Date(from)
          : dayjs(new Date()).startOf("month").toDate(),
        lte: to ? new Date(to) : dayjs(new Date()).endOf("month").toDate(),
      },
    },
    include: {
      place: true,
      bands: {
        include: {
          genres: true,
        },
      },
    },
  });
  return NextResponse.json({
    gigs: gigs,
  });
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

  const { bands, imageUrl, slug } = body;
  let blobImageUrl: string | undefined = undefined;
  if (imageUrl) {
    // Download image and store it in blob storage
    const response = await fetch(imageUrl);
    const arrayBufferImg = await (await response.blob()).arrayBuffer();
    const bufferImg = Buffer.from(arrayBufferImg);
    const resizedImg = await sharp(bufferImg)
      .resize(IMG_MAX_WIDTH, IMG_MAX_HEIGHT, {
        withoutEnlargement: true,
      })
      .toFormat(IMG_OUTPUT_FORMAT)
      .toBuffer();
    const { url } = await blobPut(slug + ".jpg", new Blob([resizedImg]), {
      access: "public",
    });
    blobImageUrl = url;
  }
  try {
    // Create inexisting bands
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const createdBand = await prisma.band.create({
          data: {
            name: band.name,
            genres: { connect: band.genres.map((g) => ({ id: g })) },
          },
        });
        return createdBand;
      }),
    );
    const toConnectBands = bands.filter((b) => b.id);
    const slug = computeGigSlug({ bands: bands, date: body.date });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeId, ...bodyWithoutPlaceId } = body;
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...bodyWithoutPlaceId,
        bands: {
          connect: [...createdBands, ...toConnectBands].map((b) => ({
            id: b.id,
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
