import dayjs from "dayjs";
import { GigWithBandsAndPlace } from "../domain/Gig/Gig.type";
import { useState } from "react";
import { getGigs } from "../domain/Gig/Gig.webService";
import usePreferences from "../hooks/usePreferences";
import { useQuery } from "@tanstack/react-query";

const gigsStaleTimeInMs = 5 * 60 * 1000;

export default function useGigs() {
  const { excludedGenres, excludedPlaces } = usePreferences();

  const [selectedMonth, setSelectedMonth] = useState(
    dayjs(new Date()).startOf("month").toDate().getTime(),
  );
  const selectedMonthStart = dayjs(new Date(selectedMonth))
    .startOf("month")
    .toDate();
  const selectedMonthEnd = dayjs(new Date(selectedMonth))
    .endOf("month")
    .toDate();

  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: ["gigs", selectedMonthStart, selectedMonthEnd],
    queryFn: async () => await getGigs(selectedMonthStart, selectedMonthEnd),
    staleTime: gigsStaleTimeInMs,
  });

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
