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
import { V_SEPARATOR, getMetadata } from "@/utils/utils";
import { getGig } from "@/domain/Gig/Gig.webService";
import { MAIN_CITY } from "@/domain/Place/constants";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  const gig = await getGig(decodedSlug);
  const { dateObject: gigDate, bandNames } = getDataFromGigSlug(decodedSlug);
  const gigTitle = getGigTitleFromGigSlug(decodedSlug);
  const dateString = gigDate
    ? " le " + dayjs(gigDate).format("dddd D MMMM YYYY")
    : "";
  const description = `${bandNames.join(V_SEPARATOR)}${dateString} - ${
    gig?.place.name
  }${gig?.place.city && gig.place.city !== MAIN_CITY ? ` (${gig.place.city})` : ""}`;

  return getMetadata(
    {
      title: gigTitle,
      description,
      assets: gig?.imageUrl,
    },
    {
      ...(gig?.imageUrl ? { images: gig.imageUrl } : {}),
      title: gigTitle,
      description,
    },
  );
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
