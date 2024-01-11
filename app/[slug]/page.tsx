import { Suspense } from "react";
import GigPage from "./gig-page";
import Layout from "@/components/Layout";
import { Center, Loader } from "@mantine/core";
import type { Metadata } from "next";
import {
  getDataFromGigSlug,
  getGigTitleFromGigSlug,
} from "@/domain/Gig/Gig.service";
import dayjs from "dayjs";
import { V_SEPARATOR } from "@/utils/utils";

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const { dateObject: gigDate, bandNames } = getDataFromGigSlug(decodedSlug);
  const gigTitle = getGigTitleFromGigSlug(decodedSlug);
  return {
    title: gigTitle,
    description: `${bandNames.join(V_SEPARATOR)} le ${dayjs(gigDate).format(
      "dddd D MMMM YYYY",
    )} - Larsen Toulousaine, votre agenda metal toulousain`,
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
