import prisma from "../../lib/prisma";
import { BandWithGenres } from "./Band.type";

export async function searchBandsByName(
  searchedName: string,
): Promise<BandWithGenres[]> {
  const results = await prisma.band.findMany({
    where: {
      name: {
        contains: searchedName,
        mode: "insensitive",
      },
    },
    include: {
      genres: true,
    },
  });
  return results;
}
