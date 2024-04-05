import dayjs from "@/lib/dayjs";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useEffect, useState } from "react";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSortedGigs from "@/hooks/useSortedGigs";
import { startOf } from "@/utils/date";

const gigsStaleTimeInMs = 5 * 60 * 1000;

export default function useGigs() {
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(startOf("month"));
  const selectedMonthStart = dayjs(selectedMonth).startOf("month").toDate();
  const selectedMonthEnd = dayjs(selectedMonth).endOf("month").toDate();

  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: [
      "gigs",
      selectedMonthStart.toISOString(),
      selectedMonthEnd.toISOString(),
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
        nextMonthStart.toISOString(),
        nextMonthEnd.toISOString(),
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
        previousMonthStart.toISOString(),
        previousMonthEnd.toISOString(),
      ],
      queryFn: async () => await getGigs(previousMonthStart, previousMonthEnd),
      staleTime: gigsStaleTimeInMs,
    });
  }, [queryClient, selectedMonthEnd, selectedMonthStart]);

  const sortedGigs = useSortedGigs(gigs || []);

  return {
    isLoading: isLoading,
    monthGigs: sortedGigs,
    selectedMonth: new Date(selectedMonth),
    setSelectedMonth,
  };
}
