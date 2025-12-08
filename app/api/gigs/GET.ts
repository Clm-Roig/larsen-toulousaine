import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import dayjs from "@/lib/dayjs";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { flattenGigBands, gigListOrderBy } from "@/app/api/utils/gigs";
import { endOf, startOf } from "@/utils/date";
import { headers } from "next/headers";
import {
  toDiscordMarkdown,
  toFacebookMarkdown,
} from "@/domain/Gig/Gig.service";
import { GigMinimal, GigPreview, MarkdownGigs } from "@/domain/Gig/Gig.type";

// See GigPreview (& BandPreview & PlacePreview)
const defaultSelect = {
  id: true,
  date: true,
  endDate: true,
  facebookEventUrl: true,
  imageUrl: true,
  isCanceled: true,
  isSoldOut: true,
  name: true,
  price: true,
  slug: true,
  ticketReservationLink: true,
  title: true,
  place: {
    select: {
      id: true,
      address: true,
      city: true,
      isSafe: true,
      name: true,
    },
  },
  bands: {
    select: {
      order: true,
      band: {
        select: {
          id: true,
          genres: true,
          name: true,
          isATribute: true,
          isLocal: true,
          isSafe: true,
        },
      },
    },
  },
} satisfies Prisma.GigSelect;

async function GET(request: NextRequest): Promise<
  NextResponse<
    | { gigs: GigPreview[] } // by date (from => to)
    | MarkdownGigs // with acceptHeader = text/markdown
    | (GigMinimal | null) // by date and place
    | { message: string } // Error case
    // eslint-disable-next-line
    | {} // 404 case
  >
> {
  const { user } = (await getServerSession(authOptions)) || {};
  const headersList = await headers();
  const acceptHeader = headersList.get("Accept");
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const query = searchParams.get("query");
  const placeId = searchParams.get("placeId");
  const date = searchParams.get("date");

  // Get by band, gig or place name
  if (query) {
    const gigs = await getGigsByName(query, !user);
    return NextResponse.json({
      gigs: gigs,
    });
  }

  // Get a gig list from/to a date
  if (from && to) {
    const gigs = await getGigsByDateFromTo(from, to, !user);
    if (acceptHeader === "text/markdown") {
      const filteredGigs = gigs.filter((g) => g.place.isSafe && !g.isCanceled);
      const lineBreak = "\\n\\n";
      const discordMarkdownGigs = filteredGigs
        .map((gig) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return toDiscordMarkdown(gig as any, lineBreak);
        })
        .join(lineBreak + lineBreak);
      const facebookMarkdownGigs = filteredGigs
        .map((gig) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return toFacebookMarkdown(gig as any, lineBreak);
        })
        .join(lineBreak + lineBreak);
      return NextResponse.json({
        discord: discordMarkdownGigs,
        facebook: facebookMarkdownGigs,
      });
    }
    return NextResponse.json({
      gigs: gigs,
    });
  }

  // Get by place and date
  if (placeId || date) {
    const gig = await getGigByPlaceAndDate(placeId, date);
    if (!gig) return NextResponse.json({}, { status: 404 });
    return NextResponse.json(gig);
  }

  return NextResponse.json(
    {
      message:
        'Bad request, you must specify some criterias too find gigs (date "from" and "to", or "placeId" and "date").',
    },
    { status: 400 },
  );
}

const getGigsByName = async (
  query: string,
  isSafeGigsOnly: boolean,
): Promise<GigPreview[]> => {
  const rawGigs = await prisma.gig.findMany({
    where: {
      OR: [
        {
          bands: {
            some: {
              band: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        },
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          place: {
            ...(isSafeGigsOnly ? { isSafe: true } : {}),
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    select: defaultSelect,
    orderBy: [
      { date: Prisma.SortOrder.desc },
      ...gigListOrderBy.filter((obj) => !obj.date),
    ],
    take: 10,
  });
  const gigs = rawGigs.map((gig) => ({
    ...gig,
    bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
  }));

  return gigs;
};

const getGigsByDateFromTo = async (
  from: string | null,
  to: string | null,
  isSafeGigsOnly: boolean,
): Promise<GigPreview[]> => {
  const rawGigs = await prisma.gig.findMany({
    where: {
      date: {
        gte: from ? new Date(from) : startOf("month"),
        lte: to ? new Date(to) : endOf("month"),
      },
      place: { ...(isSafeGigsOnly ? { isSafe: true } : {}) },
      bands: {
        ...(isSafeGigsOnly
          ? {
              every: {
                band: {
                  isSafe: true,
                },
              },
            }
          : {}),
      },
    },
    select: { ...defaultSelect },
    orderBy: gigListOrderBy,
  });
  const gigs = rawGigs.map((gig) => flattenGigBands(gig));

  return gigs;
};

const getGigByPlaceAndDate = async (
  placeId: string | null,
  date?: string | null,
): Promise<GigMinimal | null> => {
  const whereClause = {
    ...(date
      ? {
          date: {
            gte: dayjs(date).startOf("day").toDate(),
            lte: dayjs(date).endOf("day").toDate(),
          },
        }
      : {}),
    ...(placeId ? { placeId: placeId } : {}),
  };
  const rawGig = await prisma.gig.findFirst({
    where: whereClause,
    select: {
      id: true,
      name: true,
      title: true,
      date: true,
      endDate: true,
      bands: {
        select: {
          band: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: gigListOrderBy,
  });
  if (!rawGig) {
    return null;
  }

  return flattenGigBands(rawGig);
};

export default GET;
