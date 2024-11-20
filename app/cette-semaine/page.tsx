import { Box, Center, Loader, Title } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import WeekGigs from "./WeekGigs";
import { Metadata } from "next";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";
import { getMetadata } from "@/utils/utils";
import { endOf, startOf } from "@/utils/date";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Concerts et festival metal de la semaine à Toulouse";
  const gigs = await getGigs(startOf("week"), endOf("week"));
  const filteredGigs = gigs.filter((g) => !g.isCanceled);
  const images: string[] = filteredGigs.reduce((images, gig) => {
    if (!gig.imageUrl) return images;
    return [...images, gig.imageUrl];
  }, []);
  const description: string = `Agenda des concerts et festival metal de la semaine à Toulouse:\n${filteredGigs
    .map((gig) => getGigTitleFromGigSlug(gig.slug) + " - " + gig.place.name)
    .join("\n")}`;
  return getMetadata(
    {
      title: title,
      description,
      assets: images,
    },
    {
      images: images,
      title: title,
      description,
    },
  );
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
          <Title order={1} className="visually-hidden-seo-friendly">
            Concert metal de la semaine à Toulouse
          </Title>
          <WeekGigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
