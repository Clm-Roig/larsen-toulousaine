import { Box, Center, Loader, Title } from "@mantine/core";
import Layout from "@/components/Layout";
import { Suspense } from "react";
import Gigs from "@/app/gigs";
import { getMetadata } from "@/utils/metadata";
import { Metadata } from "next";

export const revalidate = 3600; // Cache cette page 1h

export function generateMetadata(): Metadata {
  const title = "Larsen Toulousaine, l'agenda des évènements metal à Toulouse";
  const description =
    "Agenda des événements metal à Toulouse et alentours : concerts au Zénith, Bikini, Rex, et dans les bars intimistes, pour vivre la scène metal de la ville rose !";
  return getMetadata(
    {
      title,
      description,
    },
    {
      title,
      description,
    },
  );
}

export default function Page() {
  return (
    <Layout>
      <Box>
        <Title order={1} className="visually-hidden-seo-friendly">
          Concerts et festivals metal à Toulouse
        </Title>
        <Suspense
          fallback={
            <Center h={200}>
              <Loader />
            </Center>
          }
        >
          <Gigs />
        </Suspense>
      </Box>
    </Layout>
  );
}
