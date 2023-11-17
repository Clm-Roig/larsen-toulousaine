import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const bands = await prisma.band.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      genres: true,
    },
  });
  return NextResponse.json({
    bands: bands,
  });
}
