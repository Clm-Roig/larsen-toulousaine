import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const places = await prisma.place.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return NextResponse.json({
    places: places,
  });
}
