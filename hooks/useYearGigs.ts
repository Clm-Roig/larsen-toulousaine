import dayjs from "@/lib/dayjs";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useState } from "react";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { useQuery } from "@tanstack/react-query";
import useSortedGigs from "@/hooks/useSortedGigs";
import { startOf } from "@/utils/date";

const gigsStaleTimeInMs = 5 * 60 * 1000;

export default function useYearGigs() {
  const [selectedYear, setSelectedYear] = useState(startOf("year"));
  const selectedYearStart = dayjs(new Date(selectedYear))
    .startOf("year")
    .toDate();
  const selectedYearEnd = dayjs(new Date(selectedYear)).endOf("year").toDate();

  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: [
      "gigs",
      selectedYearStart.toISOString(),
      selectedYearEnd.toISOString(),
    ],
    queryFn: async () => await getGigs(selectedYearStart, selectedYearEnd),
    staleTime: gigsStaleTimeInMs,
  });

  const sortedGigs = useSortedGigs(gigs || []);

  return {
    isLoading: isLoading,
    yearGigs: sortedGigs,
    selectedYear: new Date(selectedYear),
    setSelectedYear,
  };
}
