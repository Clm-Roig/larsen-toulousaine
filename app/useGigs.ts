import dayjs from "dayjs";
import { GigWithBandsAndPlace } from "../domain/Gig/Gig.type";
import { useEffect, useState } from "react";
import { getGigs } from "../domain/Gig/Gig.webService";
import usePreferences from "../hooks/usePreferences";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const gigsStaleTimeInMs = 5 * 60 * 1000;

// date is an object: it must serialized it before using it as a react-query key
const getQueryKey = (date: Date) => dayjs(date).format("MM-YYYY");

type Options = {
  initialMonthNb?: number; // Initial month goes from 1 to 12
  initialYear?: number;
};

export default function useGigs(options?: Options) {
  const { initialMonthNb, initialYear } = options || {};
  const queryClient = useQueryClient();
  const { excludedGenres, excludedPlaces, maxPrice } = usePreferences();

  const [selectedMonth, setSelectedMonth] = useState(
    initialMonthNb && initialYear
      ? new Date(initialYear, initialMonthNb - 1, 1)
      : dayjs(new Date()).startOf("month").toDate().getTime(),
  );
  const selectedMonthStart = dayjs(new Date(selectedMonth))
    .startOf("month")
    .toDate();
  const selectedMonthEnd = dayjs(new Date(selectedMonth))
    .endOf("month")
    .toDate();

  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: [
      "gigs",
      getQueryKey(selectedMonthStart),
      getQueryKey(selectedMonthEnd),
    ],
    queryFn: async () => await getGigs(selectedMonthStart, selectedMonthEnd),
    staleTime: gigsStaleTimeInMs,
  });

  // Prefetch next month gigs
  useEffect(() => {
    const nextMonthStart = dayjs(selectedMonthStart).add(1, "month").toDate();
    const nextMonthEnd = dayjs(selectedMonthEnd).add(1, "month").toDate();
    void queryClient.prefetchQuery({
      queryKey: [
        "gigs",
        getQueryKey(nextMonthStart),
        getQueryKey(nextMonthEnd),
      ],
      queryFn: async () => await getGigs(nextMonthStart, nextMonthEnd),
      staleTime: gigsStaleTimeInMs,
    });
  }, [queryClient, selectedMonthEnd, selectedMonthStart]);

  // Prefetch previous month gigs
  useEffect(() => {
    const previousMonthStart = dayjs(selectedMonthStart)
      .subtract(1, "month")
      .toDate();
    const previousMonthEnd = dayjs(selectedMonthEnd)
      .subtract(1, "month")
      .toDate();
    void queryClient.prefetchQuery({
      queryKey: [
        "gigs",
        getQueryKey(previousMonthStart),
        getQueryKey(previousMonthEnd),
      ],
      queryFn: async () => await getGigs(previousMonthStart, previousMonthEnd),
      staleTime: gigsStaleTimeInMs,
    });
  }, [queryClient, selectedMonthEnd, selectedMonthStart]);

  const sortedGigs = gigs
    // Genre(s) filtering
    ?.filter((gig) =>
      gig.bands.some((band) =>
        band.genres.every(
          (genre) => !excludedGenres?.map((g) => g.id).includes(genre.id),
        ),
      ),
    )
    // Place(s) filtering
    .filter((gig) => !excludedPlaces?.includes(gig.placeId))
    // Price filtering
    .filter(
      (gig) =>
        !gig.price ||
        !maxPrice ||
        maxPrice === 0 ||
        (!Number.isNaN(maxPrice) && gig.price <= Number(maxPrice)),
    )
    .sort(
      (g1, g2) => new Date(g1.date).getTime() - new Date(g2.date).getTime(),
    );

  return {
    excludedGenres: excludedGenres || [],
    isLoading: isLoading,
    monthGigs: sortedGigs,
    selectedMonth: new Date(selectedMonth),
    setSelectedMonth,
  };
}
