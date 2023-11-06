import Gigs from "@/app/gigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { Genre } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export default async function GigsPage() {
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const places = await getPlaces();
  return <Gigs genres={genres || []} places={places} />;
}
