import { CreatePlaceArgs } from "@/domain/Place/Place.webService";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { gigs: true },
      },
    },
  });
  return NextResponse.json({
    places: places,
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreatePlaceArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  try {
    const createdGig = await prisma.place.create({
      data: Prisma.validator<Prisma.PlaceCreateInput>()({
        ...body,
      }),
      include: {
        _count: {
          select: { gigs: true },
        },
      },
    });
    return NextResponse.json(createdGig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to create a place.",
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
