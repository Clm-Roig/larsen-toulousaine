import { Gig } from "@prisma/client";
import prisma from "../../lib/prisma";
import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";

export const getGigs = async (): Promise<GigWithBandsAndPlace[]> => {
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
  return gig;
};

export const createGig = async (gig: GigWithAuthor & GigWithBandsAndPlace) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createdGig = await prisma.gig.create({
      data: {
        ...gig,
        // Dirty fix to calm down TypeScript
        authorId: undefined,
        placeId: undefined,
        author: {
          connect: gig.author,
        },
        place: {
          connect: gig.place,
        },
        bands: {
          connectOrCreate: gig.bands.map((band) => ({
            where: { id: band.id },
            create: {
              name: band.name,
              genres: {
                connect: band.genres,
              },
            },
          })),
        },
      },
    });
    // eslint-disable-next-line no-console
    console.log(createdGig);
    return createdGig;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
