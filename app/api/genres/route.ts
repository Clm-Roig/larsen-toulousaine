import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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
