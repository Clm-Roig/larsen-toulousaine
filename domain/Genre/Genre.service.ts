import { Genre } from "@prisma/client";

export const getGenreColor = (genre: Genre): string => {
  if (genre.color) {
    return genre.color;
  }
  return "#eeeeee";
};
