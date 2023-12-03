import { Band, Genre } from "@prisma/client";
import { BandWithGenres, BandWithOrder } from "./Band.type";
import { V_SEPARATOR } from "@/utils/utils";

export function getBandNames(bands: Band[] | BandWithOrder[]): string {
  return bands
    .sort((b1, b2) => {
      if ("order" in b1 && "order" in b2) {
        return (b1 as BandWithOrder).order - (b2 as BandWithOrder).order;
      }
      return 0;
    })
    .map((b: Band) => b.name)
    .join(V_SEPARATOR);
}

type CountedGenre = { count: number } & Genre;

/**
 * Genres are sorted by:
 *  1. "metal" genres first (= with a defined color)
 *  2. nb of genre occurences
 *  3. alphabetical order
 */
export function getSortedUniqueBandGenres(bands: BandWithGenres[]): Genre[] {
  const countedGenres = bands.reduce((countedGenres: CountedGenre[], band) => {
    const updatedGenres = band.genres.map((genre) => {
      const foundCountGenre = countedGenres.find(
        (uniqueGenre) => uniqueGenre.id === genre.id,
      );
      if (!foundCountGenre) {
        return { ...genre, count: 1 };
      }
      return { ...foundCountGenre, count: foundCountGenre.count + 1 };
    });

    const previousGenres = countedGenres.filter((g) =>
      updatedGenres.every((g2) => g2.id !== g.id),
    );

    return [...previousGenres, ...updatedGenres];
  }, []);
  return countedGenres
    .sort((g1, g2) => {
      // With color = metal genre = has priority over the other one
      if (!g1.color) return 1;
      if (!g2.color) return -1;

      // More occurences
      const diff = g2.count - g1.count;
      if (diff !== 0) {
        return diff;
      }

      // Alphabetical order
      return g1.name.localeCompare(g2.name);
    })
    .map((g) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { count, ...rest } = g;
      return rest;
    });
}
