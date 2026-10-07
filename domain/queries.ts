import { UseQueryOptions } from "@tanstack/react-query";
import { getPlaces } from "./Place/Place.webService";
import { getOrganizations } from "./Organization/Organization.webService";
import { PlaceWithGigCount } from "./Place/Place.type";
import { getGenres } from "./Genre/Genre.webService";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";
import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";

export const placesQuery: UseQueryOptions<PlaceWithGigCount[]> = {
  queryKey: ["places"],
  queryFn: async () => await getPlaces(),
  staleTime: 1000 * 60 * 60 * 1, // 1h in ms
};

export const genresQuery: UseQueryOptions<GenreWithBandCount[]> = {
  queryKey: ["genres"],
  queryFn: async () => await getGenres(),
  staleTime: 1000 * 60 * 60 * 1, // 1h in ms
};

export const organizationsQuery: UseQueryOptions<OrganizationWithGigCount[]> = {
  queryKey: ["organizations"],
  queryFn: async () => await getOrganizations(),
  staleTime: 1000 * 60 * 60 * 1, // 1h in ms
};
