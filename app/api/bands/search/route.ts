import { NB_OF_BANDS_PER_PAGE } from "@/domain/Band/constants";
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
  const {
    nextUrl: { searchParams },
  } = request;
  const rawSearchedName = searchParams.get("name");
  const rawGenres = searchParams.get("genres");
  const page = searchParams.get("page");
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
      skip: (page !== null ? parseInt(page, 10) : 0) * NB_OF_BANDS_PER_PAGE,
      take: NB_OF_BANDS_PER_PAGE,
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
