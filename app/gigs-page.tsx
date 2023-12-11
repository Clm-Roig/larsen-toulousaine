"use client";

import Gigs from "@/app/gigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { Genre, Place } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default function GigsPage() {
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });

  const safePlaces = places?.filter((p) => p.isSafe);
  return <Gigs genres={genres || []} places={safePlaces || []} />;
}
