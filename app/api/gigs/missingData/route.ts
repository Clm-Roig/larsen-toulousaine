import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { mustBeAuthenticatedError, toResponse } from "@/domain/errors";
import { Prisma } from "@prisma/client";

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

  const rawGigs = (
    await prisma.gig.findMany({
      where: {
        date: {
          gte: dayjs(new Date()).toDate(),
        },
      },
      include: defaultInclude,
      orderBy: { date: Prisma.SortOrder.asc },
    })
  )
    // Filtering here because Prisma can't filter gigs with only 1 or 0 bands.
    .filter(
      (g) =>
        g.bands?.length <= 1 ||
        g.price === null ||
        g.imageUrl === null ||
        g.imageUrl === "" ||
        g.facebookEventUrl === null ||
        g.hasTicketReservationLink === null,
    );

  const gigs = rawGigs.map((gig) => ({
    ...gig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
  }));
  return NextResponse.json({
    gigs: gigs,
  });
}
