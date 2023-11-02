import prisma from "../../lib/prisma";
import { Gig } from "./Gig.type";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getGigs = async (): Promise<Gig[]> => {
  await sleep(2000);
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

  return gigs.map((gig) => ({
    ...gig,
    // TODO: find a better / automatic way to convert dates
    createdAt: gig.createdAt.toISOString(),
    date: gig.date.toISOString(),
    updatedAt: gig.updatedAt.toISOString(),
  }));
};

export const getGig = async (id: string): Promise<Gig | undefined> => {
  const gig = await prisma.gig.findUnique({
    where: {
      id: String(id),
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
  if (!gig) return undefined;
  return {
    ...gig,
    // TODO: find a better / automatic way to convert dates
    createdAt: gig?.createdAt.toISOString(),
    date: gig.date.toISOString(),
    updatedAt: gig?.updatedAt.toISOString(),
  };
};
