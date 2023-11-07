import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

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
  try {
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()(body),
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
