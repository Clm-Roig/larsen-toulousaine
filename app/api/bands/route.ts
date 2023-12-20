import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const bands = await prisma.band.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      genres: true,
      _count: {
        select: { gigs: true },
      },
    },
  });
  return NextResponse.json({
    bands: bands,
  });
}
