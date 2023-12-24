import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { gigs: true },
      },
    },
  });
  return NextResponse.json({
    places: places,
  });
}
