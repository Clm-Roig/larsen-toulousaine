import { Suspense } from "react";
import Layout from "../../components/Layout";
import { Box, Center, Loader, Title } from "@mantine/core";
import GigsPage from "./gigs-page";
import { getGenres } from "../../domain/Genre/Genre.webService";
import { getPlaces } from "../../domain/Place/Place.webService";

export default async function Page() {
  const genres = await getGenres();
  const places = await getPlaces();

  return (
    <Layout>
      <Title order={2}>Tous les concerts</Title>
      <Box>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <GigsPage genres={genres} places={places} />
        </Suspense>
      </Box>
    </Layout>
  );
}
