import { NB_OF_BANDS_PER_PAGE } from "@/domain/Band/constants";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  // Prisma doesn't handle findMany + count in one transaction
  // See https://github.com/prisma/prisma/issues/7550
  const [count, bands] = await prisma.$transaction([
    prisma.band.count(),
    prisma.band.findMany({
      orderBy: {
        name: "asc",
      },
      skip: (page !== null ? parseInt(page, 10) : 0) * NB_OF_BANDS_PER_PAGE,
      take: NB_OF_BANDS_PER_PAGE,
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
