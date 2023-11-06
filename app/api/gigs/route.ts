import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const gigs = await prisma.gig.findMany({
    where: {
      date: {
        gte: from
          ? new Date(from)
          : dayjs(new Date()).startOf("month").toDate(),
        lte: to ? new Date(to) : dayjs(new Date()).endOf("month").toDate(),
      },
    },
    include: {
      place: true,
      bands: {
        include: {
          genres: true,
        },
      },
    },
  });
  return NextResponse.json({
    gigs: gigs,
  });
}

export async function POST(request: Request) {
  const gigData = await request.json();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json(gigData);
}

export async function DELETE() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({});
}
