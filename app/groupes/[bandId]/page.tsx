import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import BandPage from "./band-page";

type Props = {
  params: { bandId: string };
};

export default function Page({ params }: Props) {
  const { bandId } = params;

  return (
    <Layout withPaper>
      <Box>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <BandPage bandId={bandId} />
        </Suspense>
      </Box>
    </Layout>
  );
}
