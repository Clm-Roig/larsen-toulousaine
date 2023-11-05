"use server";

import { Prisma } from "@prisma/client";
import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";
import dayjs from "dayjs";
import prisma from "@/lib/prisma";
import { computeGigSlug } from "@/domain/Gig/Gig.service";

export async function getGigs(
  from = dayjs(new Date()).startOf("month").toDate(),
  to = dayjs(new Date()).endOf("month").toDate(),
): Promise<GigWithBandsAndPlace[]> {
  const gigs = await prisma.gig.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
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
  return gigs;
}

export async function getGig(
  idOrSlug: string,
): Promise<(GigWithBandsAndPlace & GigWithAuthor) | undefined> {
  const gig = await prisma.gig.findFirst({
    where: {
      OR: [
        {
          id: {
            equals: idOrSlug,
          },
        },
        {
          slug: {
            equals: idOrSlug,
          },
        },
      ],
    },
    include: {
      author: true,
      place: true,
      bands: {
        include: {
          genres: true,
        },
      },
    },
  });
  if (!gig) return undefined;
  return gig;
}

export async function createGig(gig: Omit<Prisma.GigCreateInput, "slug">) {
  const createdGig = await prisma.gig.create({
    data: {
      ...gig,
      // @ts-ignore
      slug: computeGigSlug({
        ...gig,
        bands: [
          // @ts-ignore
          ...(gig.bands?.connect || []),
          // @ts-ignore
          ...(gig.bands?.connectOrCreate || []),
          // @ts-ignore
          ...(gig.bands?.create || []),
        ],
      }),
    },
  });
  return createdGig;
}
