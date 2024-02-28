import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { mustBeAuthenticatedError, toResponse } from "@/domain/errors";

const defaultInclude = {
  place: true,
  bands: {
    include: {
      band: {
        include: {
          genres: true,
        },
      },
    },
  },
};

export async function GET() {
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const rawGigs = await prisma.gig.findMany({
    where: {
      date: {
        gte: dayjs(new Date()).toDate(),
      },
      OR: [
        { price: null },
        // Prisma doesn't provide a way to check both null and "" at the same type
        { imageUrl: null },
        { imageUrl: "" },
        { ticketReservationLink: null },
        { ticketReservationLink: "" },
      ],
    },
    include: defaultInclude,
    orderBy: [{ date: Prisma.SortOrder.asc }],
  });
  const gigs = rawGigs.map((gig) => ({
    ...gig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
  }));
  return NextResponse.json({
    gigs: gigs,
  });
}
