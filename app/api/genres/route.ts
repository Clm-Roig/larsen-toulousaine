import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/errors";
import { CreateGenreArgs } from "@/domain/Genre/Genre.webService";
import prisma from "@/lib/prisma";
import { authOptions } from "@/utils/authOptions";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const genres = await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          bands: true,
        },
      },
    },
  });
  return NextResponse.json({
    genres: genres.map((g) => {
      const genreWithoutCount = { ...g, _count: undefined };
      return {
        ...genreWithoutCount,
        count: g._count.bands,
      };
    }),
  });
}

export async function POST(request: NextRequest) {
  let body: CreateGenreArgs;
  try {
    body = (await request.json()) as CreateGenreArgs;
  } catch {
    return toResponse(missingBodyError);
  }

  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  try {
    const createdGenre = await prisma.genre.create({
      data: Prisma.validator<Prisma.GenreCreateInput>()({
        ...body,
      }),
      include: {
        _count: {
          select: { bands: true },
        },
      },
    });
    return NextResponse.json(createdGenre);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to create a genre.",
        },
        { status: 400 },
      );
    }
    return toResponse(unknownError);
  }
}
