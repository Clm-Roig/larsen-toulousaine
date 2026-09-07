import { Genre } from "@prisma/client";

export interface GenreWithBandCount extends Genre {
  count: number;
}
