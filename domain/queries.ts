import { UseQueryOptions } from "@tanstack/react-query";
import { getPlaces } from "./Place/Place.webService";
import { PlaceWithGigCount } from "./Place/Place.type";
import { getGenres } from "./Genre/Genre.webService";
import { Genre } from "@prisma/client";

export const placesQuery: UseQueryOptions<PlaceWithGigCount[]> = {
  queryKey: ["places"],
  queryFn: async () => await getPlaces(),
  staleTime: 1000 * 60 * 60 * 1, // 1h in ms
};

export const genresQuery: UseQueryOptions<Genre[]> = {
  queryKey: ["genres"],
  queryFn: async () => await getGenres(),
  staleTime: 1000 * 60 * 60 * 1, // 1h in ms
};
