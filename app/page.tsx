import { Box, Center, Loader } from "@mantine/core";
import Layout from "../components/Layout";
import { Suspense } from "react";
import Gigs from "./gigs";
import { getGenres } from "../domain/Genre/Genre.webService";
import { getPlaces } from "../domain/Place/Place.webService";

export default async function Page() {
  const genres = await getGenres();
  const places = await getPlaces();
  return (
    <Layout>
      <Box>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <Gigs genres={genres} places={places} />
        </Suspense>
      </Box>
    </Layout>
  );
}
