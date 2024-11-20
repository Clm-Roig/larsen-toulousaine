import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import InfosManquantesPage from "./infos-manquantes-page";

import { getMetadata } from "@/utils/metadata";

export const metadata = getMetadata({
  title: "Infos manquantes",
});

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
          <InfosManquantesPage />
        </Suspense>
      </Box>
    </Layout>
  );
}
