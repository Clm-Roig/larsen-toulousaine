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

export function getUniqueBandGenres(bands: BandWithGenres[]): Genre[] {
  return bands.reduce((uniqueGenres: Genre[], band) => {
    const newGenres = band.genres.filter((genre) =>
      uniqueGenres.every((uniqueGenre) => uniqueGenre.id !== genre.id),
    );
    return [...uniqueGenres, ...newGenres];
  }, []);
}
