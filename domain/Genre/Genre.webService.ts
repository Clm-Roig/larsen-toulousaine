import { Genre } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getGenres = async (): Promise<Genre[]> => {
  const genres = await prisma.genre.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return genres;
};
