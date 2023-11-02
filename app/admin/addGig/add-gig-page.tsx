import GigForm from "../../../components/GigForm";
import { getGenres } from "../../../domain/Genre/Genre.webService";
import { getPlaces } from "../../../domain/Place/Place.webService";
import { Box } from "@mantine/core";

export default async function AddGig() {
  const genres = await getGenres();
  const places = await getPlaces();

  return (
    <Box w={750}>
      <GigForm genres={genres} places={places} />
    </Box>
  );
}
