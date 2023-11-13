import { stringToColor } from "@/utils/color";
import { Genre } from "@prisma/client";

export const getGenreColor = (genre: Genre): string => {
  if (genre?.color) {
    return genre.color;
  }
  return stringToColor(genre.name);
};
