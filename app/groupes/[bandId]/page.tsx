import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import BandPage from "./band-page";

type Props = {
  params: Promise<{ bandId: string }>;
};

export default async function Page({ params }: Props) {
  const { bandId } = await params;

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
