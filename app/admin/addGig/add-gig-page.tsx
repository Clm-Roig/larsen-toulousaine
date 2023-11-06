import GigForm from "@/components/GigForm";
import { getPlaces } from "@/domain/Place/Place.webService";
import { Box } from "@mantine/core";

export default async function AddGig() {
  const places = await getPlaces();

  return (
    <Box w={750}>
      <GigForm places={places} />
    </Box>
  );
}
