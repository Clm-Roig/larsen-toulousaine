"use server";

import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";

export async function getGigs(): Promise<GigWithBandsAndPlace[]> {
  const gigs = await prisma.gig.findMany({
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
  id: string,
): Promise<(GigWithBandsAndPlace & GigWithAuthor) | undefined> {
  const gig = await prisma.gig.findUnique({
    where: {
      id: String(id),
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

export async function createGig(gig: Prisma.GigCreateInput) {
  const createdGig = await prisma.gig.create({
    data: gig,
  });
  return createdGig;
}
