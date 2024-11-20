import { Box, Center, Loader, Title } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import WeekGigs from "./WeekGigs";
import { Metadata } from "next";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { getGigsMetadata, getMetadata } from "@/utils/metadata";
import { endOf, startOf } from "@/utils/date";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Concerts et festival metal de la semaine à Toulouse";
  const gigs = await getGigs(startOf("week"), endOf("week"));
  const { gigDescriptions, gigImages } = getGigsMetadata(gigs);
  const description: string = `Agenda des concerts et festivals metal de la semaine à Toulouse :\n${gigDescriptions.join(
    "\n",
  )}`;
  return getMetadata(
    {
      title: title,
      description,
      assets: gigImages,
    },
    {
      images: gigImages,
      title: title,
      description,
    },
  );
}

export default function Page() {
  return (
    <Layout>
      <Box>
        <Title order={1} className="visually-hidden-seo-friendly">
          Concerts et festivals metal de la semaine à Toulouse
        </Title>
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
