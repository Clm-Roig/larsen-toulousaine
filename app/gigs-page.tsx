import Gigs from "@/app/gigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";

export default async function GigsPage() {
  const genres = await getGenres();
  const places = await getPlaces();
  return <Gigs genres={genres} places={places} />;
}
