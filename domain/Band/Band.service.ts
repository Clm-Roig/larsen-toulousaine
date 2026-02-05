import { Genre } from "@prisma/client";
import { BandPreviewWithOrder, BandWithOrder } from "./Band.type";
import { V_SEPARATOR } from "@/utils/utils";

export function getBandNames(
  bands: { order?: number; name: string }[],
): string {
  return bands
    .sort((b1, b2) => {
      if ("order" in b1 && "order" in b2) {
        return (b1 as BandWithOrder).order - (b2 as BandWithOrder).order;
      }
      return b1.name.localeCompare(b2.name);
    })
    .map((b) => b.name)
    .join(V_SEPARATOR);
}

type CountedGenre = { count: number } & Genre;

export function getSortedUniqueBandGenres(
  bands: BandPreviewWithOrder[],
): Genre[] {
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

  return getSortedGenres(countedGenres);
}

/**
 * Genres are sorted by:
 *  1. nb of genre occurences
 *  2. "metal" genre first
 *  3. alphabetical order
 */
export const getSortedGenres = (
  genres: (Genre & { count?: number })[],
): Genre[] => {
  return genres
    .sort((g1, g2) => {
      const count1 = g1.count ?? 0;
      const count2 = g2.count ?? 0;

      // More occurences (if provided)
      if (count2 !== count1) return count2 - count1;

      // With color = metal genre = has priority over the other one
      const g1IsMetal = !!g1.color;
      const g2IsMetal = !!g2.color;
      if (g1IsMetal !== g2IsMetal) return g1IsMetal ? -1 : 1;

      // Alphabetical order
      return g1.name.localeCompare(g2.name);
    })
    .map((g) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { count: _, ...rest } = g;
      return rest;
    });
};
