import { Genre } from "@prisma/client";
import { stringToColor } from "../../utils/utils";

export const getGenreColor = (genre: Genre): string => {
  if (genre?.color) {
    return genre.color;
  }
  return stringToColor(genre.name);
};
