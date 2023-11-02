import { Place } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getPlaces = async (): Promise<Place[]> => {
  const places = await prisma.place.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return places;
};
