import { Suspense } from "react";
import Layout from "../../components/Layout";
import { Box, Center, Loader, Title } from "@mantine/core";
import GigsPage from "./gigs-page";

export default function Page() {
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
          <GigsPage />
        </Suspense>
      </Box>
    </Layout>
  );
}
