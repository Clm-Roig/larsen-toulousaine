import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawSearchQuery = request.nextUrl.searchParams.get("query");
  const searchQuery = rawSearchQuery
    ? decodeURIComponent(rawSearchQuery)
    : undefined;
  const bands = await prisma.band.findMany({
    take: 10,
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
    },
    include: {
      genres: true,
    },
  });
  return NextResponse.json({
    bands: bands,
  });
}
