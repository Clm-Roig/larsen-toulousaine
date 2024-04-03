import { NB_OF_BANDS_RETURNED } from "@/domain/Band/constants";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param request
 *  - name    {string}
 *  - genres  {string}  genre ids separated by a comma
 */
export async function GET(request: NextRequest) {
  const rawSearchedName = request.nextUrl.searchParams.get("name");
  const rawGenres = request.nextUrl.searchParams.get("genres");
  const searchedName = rawSearchedName
    ? decodeURIComponent(rawSearchedName)
    : undefined;
  const searchedGenres = rawGenres ? decodeURIComponent(rawGenres) : undefined;
  const genreIds = searchedGenres?.split(",");

  const whereClause: Prisma.BandWhereInput = {
    name: {
      contains: searchedName,
      mode: "insensitive",
    },
    genres: {
      some: {
        id: {
          in: genreIds,
        },
      },
    },
  };
  const [count, bands] = await prisma.$transaction([
    prisma.band.count({
      where: whereClause,
    }),
    prisma.band.findMany({
      orderBy: {
        name: "asc",
      },
      take: NB_OF_BANDS_RETURNED,
      where: whereClause,
      include: {
        genres: true,
        _count: {
          select: { gigs: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    bands: bands,
    count: count,
  });
}
