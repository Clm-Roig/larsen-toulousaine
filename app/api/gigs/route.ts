import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { put as blobPut } from "@vercel/blob";
import sharp from "sharp";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

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
  const body = await request.json();
  if (!body) {
    return NextResponse.json(
      { message: "You must provide gig data in the request body." },
      { status: 400 },
    );
  }

  const { imageUrl, slug } = body;
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
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...body,
        imageUrl: blobImageUrl,
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
