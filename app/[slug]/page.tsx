import { Suspense } from "react";
import GigPage from "./gig-page";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug: gigSlug } = params;
  return (
    <Layout withPaper>
      <Suspense
        fallback={
          <Center>
            <Loader />
          </Center>
        }
      >
        <GigPage gigSlug={gigSlug} />
      </Suspense>
    </Layout>
  );
}
