import { Box, Title } from "@mantine/core";
import Layout from "@/components/Layout";
import Gigs from "@/app/gigs";
import { getMetadata } from "@/utils/metadata";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { SearchParams } from "next/dist/server/request/search-params";

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

interface Props {
  searchParams?: Promise<SearchParams>;
}
export default async function Page({ searchParams }: Props) {
  const queryClient = new QueryClient();
  const année = (await searchParams)?.année;
  const mois = (await searchParams)?.mois;

  const year = année ? Number(année) : undefined;
  const month = mois ? Number(mois) - 1 : undefined; // months start at 1

  const baseDate =
    year !== undefined && month !== undefined && !isNaN(year) && !isNaN(month)
      ? new Date(year, month, 1)
      : new Date();

  const currentStart = dayjs(baseDate).startOf("month").toDate();
  const currentEnd = dayjs(baseDate).endOf("month").toDate();

  const prevStart = dayjs(currentStart).subtract(1, "month").toDate();
  const prevEnd = dayjs(currentEnd).subtract(1, "month").toDate();

  const nextStart = dayjs(currentStart).add(1, "month").toDate();
  const nextEnd = dayjs(currentEnd).add(1, "month").toDate();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["gigs", currentStart.toISOString(), currentEnd.toISOString()],
      queryFn: () => getGigs(currentStart, currentEnd),
    }),
    queryClient.prefetchQuery({
      queryKey: ["gigs", prevStart.toISOString(), prevEnd.toISOString()],
      queryFn: () => getGigs(prevStart, prevEnd),
    }),
    queryClient.prefetchQuery({
      queryKey: ["gigs", nextStart.toISOString(), nextEnd.toISOString()],
      queryFn: () => getGigs(nextStart, nextEnd),
    }),
    queryClient.prefetchQuery({
      queryKey: ["genres"],
      queryFn: getGenres,
    }),
    queryClient.prefetchQuery({
      queryKey: ["places"],
      queryFn: getPlaces,
    }),
  ]);
  return (
    <Layout>
      <Box>
        <Title order={1} className="visually-hidden-seo-friendly">
          Concerts et festivals metal à Toulouse
        </Title>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Gigs initialMonth={baseDate} />
        </HydrationBoundary>
      </Box>
    </Layout>
  );
}
