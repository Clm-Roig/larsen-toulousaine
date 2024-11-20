import { Box, Center, Loader, Title } from "@mantine/core";
import Layout from "../components/Layout";
import { Suspense } from "react";
import Gigs from "@/app/gigs";
import { getGigsMetadata, getMetadata } from "@/utils/metadata";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { endOf, startOf } from "@/utils/date";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const gigs = await getGigs(startOf("week"), endOf("week"));
  const { gigDescriptions, gigImages } = getGigsMetadata(gigs);
  const description: string = `Agenda des concerts et festival metal à Toulouse (black metal, crust, death metal, deathcore, doom metal, gothique, grindcore, hard rock, hardcore, heavy metal, metal industriel, néo metal, power metal, punk, screamo, sludge, stoner, thrash metal...):\n${gigDescriptions.join(
    "\n",
  )}`;
  return getMetadata(
    {
      description,
      assets: gigImages,
    },
    {
      images: gigImages,
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
            Concert metal à Toulouse
          </Title>
          <Gigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
