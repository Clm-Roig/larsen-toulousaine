import { authOptions } from "@/utils/authOptions";
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
import { EditGenreArgs } from "@/domain/Genre/Genre.webService";

export async function PUT(request: NextRequest) {
  let body: EditGenreArgs;
  try {
    body = (await request.json()) as EditGenreArgs;
  } catch {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { id, name, color } = body;
  try {
    const updatedGenre = await prisma.genre.update({
      where: { id: id },
      data: Prisma.validator<Prisma.GenreUpdateInput>()({
        name: name,
        color: color,
      }),
    });

    return NextResponse.json(updatedGenre);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update a genre.",
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
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    await prisma.genre.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);

    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete a genre.",
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
