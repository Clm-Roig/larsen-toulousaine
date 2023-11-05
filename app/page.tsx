import { Box, Center, Loader } from "@mantine/core";
import Layout from "../components/Layout";
import { Suspense } from "react";
import GigsPage from "@/app/gigs-page";

export default function Page() {
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
          <GigsPage />
        </Suspense>
      </Box>
    </Layout>
  );
}
