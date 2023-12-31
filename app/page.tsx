import { Box, Center, Loader } from "@mantine/core";
import Layout from "../components/Layout";
import { Suspense } from "react";
import Gigs from "@/app/gigs";

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
          <Gigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
