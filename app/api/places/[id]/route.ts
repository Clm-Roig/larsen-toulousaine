import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EditPlaceArgs } from "@/domain/Place/Place.webService";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as EditPlaceArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { id, address, city, isClosed, isSafe, name, website } = body;
  try {
    const updatedPlace = await prisma.place.update({
      where: { id: id },
      data: Prisma.validator<Prisma.PlaceUpdateInput>()({
        address: address,
        city: city,
        isClosed: isClosed,
        isSafe: isSafe,
        name: name,
        website: website,
      }),
    });

    return NextResponse.json(updatedPlace);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update a place.",
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
  { params }: { params: { id: string } },
) {
  const { id: rawId } = params;
  const id = decodeURIComponent(rawId);
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    await prisma.place.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete a place.",
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
