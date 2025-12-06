import { CreatePlaceArgs } from "@/domain/Place/Place.webService";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { authOptions } from "@/utils/authOptions";
import { getPrismaOrderByFromRequest } from "@/app/api/utils/orderBy";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortBy = searchParams.getAll("sortBy");
  const order = searchParams.getAll("order") as Prisma.SortOrder[];

  const orderBy = getPrismaOrderByFromRequest({
    validFields: ["name", "gigs._count"],
    order: order,
    sortBy: sortBy,
    defaultSort: { name: "asc" },
  });
  const places = await prisma.place.findMany({
    orderBy: orderBy,
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
