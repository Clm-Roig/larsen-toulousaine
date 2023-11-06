"use server";

import { Prisma } from "@prisma/client";
import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";
import prisma from "@/lib/prisma";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import api, { getErrorMessage } from "@/lib/axios";

export const getGigs = async (
  from: Date,
  to: Date,
): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?from=${from.toString()}&to=${to.toString()}`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

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
