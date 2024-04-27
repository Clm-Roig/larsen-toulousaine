import { Suspense } from "react";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import EditGig from "./edit-gig-page";
import { getMetadata } from "@/utils/utils";

export const metadata = getMetadata({
  title: "Édition d'un concert",
});

export default function Page({ params }: { params: { slug: string } }) {
  const { slug: gigSlug } = params;
  return (
    <Layout title="Éditer un concert" withPaper>
      <Center>
        <Suspense fallback={<Loader />}>
          <EditGig gigSlug={gigSlug} />
        </Suspense>
      </Center>
    </Layout>
  );
}
