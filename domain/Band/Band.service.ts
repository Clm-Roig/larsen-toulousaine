import { Band, Genre } from "@prisma/client";
import { BandWithGenres } from "./Band.type";

export function getBandNames(bands: Band[]): string {
  return bands.map((b) => b.name).join(" | ");
}

export function getUniqueBandGenres(bands: BandWithGenres[]): Genre[] {
  return bands.reduce((uniqueGenres: Genre[], band) => {
    const newGenres = band.genres.filter((genre) =>
      uniqueGenres.every((uniqueGenre) => uniqueGenre.id !== genre.id),
    );
    return [...uniqueGenres, ...newGenres];
  }, []);
}
