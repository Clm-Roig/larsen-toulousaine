import { Suspense } from "react";
import GigPage from "./gig-page";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import type { Metadata } from "next";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const { slug } = params;
  const gigTitle = getGigTitleFromGigSlug(decodeURIComponent(slug));
  return {
    title: gigTitle,
  };
}

export default function Page({ params }: Props) {
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
