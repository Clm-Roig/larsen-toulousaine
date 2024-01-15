import { Box, Center, Loader } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import WeekGigs from "./WeekGigs";
import { Metadata } from "next";
import { getGigs } from "@/domain/Gig/Gig.webService";
import dayjs from "dayjs";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Concerts metal de la semaine à Toulouse";
  const gigs = await getGigs(
    dayjs().startOf("week").toDate(),
    dayjs().endOf("week").toDate(),
  );
  const images: string[] = gigs.reduce((images, gig) => {
    if (!gig.imageUrl) return images;
    return [...images, gig.imageUrl];
  }, []);
  const description: string = gigs
    .map((gig) => getGigTitleFromGigSlug(gig.slug))
    .join("\n");
  return {
    title: title,
    description,
    assets: images,
    openGraph: {
      images: images,
      title: title,
      description,
    },
  };
}

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
          <WeekGigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
