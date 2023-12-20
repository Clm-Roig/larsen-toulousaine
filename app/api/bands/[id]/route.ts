import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EditBandArgs } from "@/domain/Band/Band.webService";
import { cantDeleteBandBecauseInGigError } from "@/domain/Band/errors";
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
  const body = (await request.json()) as EditBandArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { id, genres, name } = body;
  try {
    const updatedBand = await prisma.band.update({
      where: { id: id },
      data: Prisma.validator<Prisma.BandUpdateInput>()({
        name: name,
        genres: {
          set: genres.map((gId) => ({ id: gId })),
        },
      }),
      include: { genres: true },
    });

    return NextResponse.json(updatedBand);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update a band.",
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
    await prisma.band.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    // Trying to delete a band related to a gig
    if (
      error?.code === "P2003" &&
      error?.meta?.field_name === "BandsOnGigs_bandId_fkey (index)"
    ) {
      return toResponse(cantDeleteBandBecauseInGigError());
    }
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete a band.",
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
