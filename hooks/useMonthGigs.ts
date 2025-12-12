import dayjs from "@/lib/dayjs";
import { GigPreview } from "@/domain/Gig/Gig.type";
import { useEffect, useState } from "react";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFilteredGigs from "@/hooks/useFilteredGigs";
import { startOf } from "@/utils/date";
import { GIGS_STALE_TIME_IN_MS } from "@/domain/Gig/constants";

export default function useMonthGigs() {
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(startOf("month"));
  const selectedMonthStart = dayjs(selectedMonth).startOf("month").toDate();
  const selectedMonthEnd = dayjs(selectedMonth).endOf("month").toDate();
  const {
    data: gigs,
    isLoading,
    isFetched,
  } = useQuery<GigPreview[]>({
    queryKey: [
      "gigs",
      selectedMonthStart.toISOString(),
      selectedMonthEnd.toISOString(),
    ],
    queryFn: async () => await getGigs(selectedMonthStart, selectedMonthEnd),
    staleTime: GIGS_STALE_TIME_IN_MS,
  });

  // Prefetch next month gigs (only after currently month's gig are fetched)
  useEffect(() => {
    if (isFetched) {
      const nextMonthStart = dayjs(selectedMonthStart).add(1, "month").toDate();
      const nextMonthEnd = dayjs(selectedMonthEnd).add(1, "month").toDate();
      void queryClient.prefetchQuery({
        queryKey: [
          "gigs",
          nextMonthStart.toISOString(),
          nextMonthEnd.toISOString(),
        ],
        queryFn: async () => await getGigs(nextMonthStart, nextMonthEnd),
        staleTime: GIGS_STALE_TIME_IN_MS,
      });
    }
  }, [isFetched, queryClient, selectedMonthEnd, selectedMonthStart]);

  // Prefetch previous month gigs (only after currently month's gig are fetched)
  useEffect(() => {
    if (isFetched) {
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
        queryFn: async () =>
          await getGigs(previousMonthStart, previousMonthEnd),
        staleTime: GIGS_STALE_TIME_IN_MS,
      });
    }
  }, [isFetched, queryClient, selectedMonthEnd, selectedMonthStart]);

  const filteredGigs = useFilteredGigs(gigs ?? []);

  return {
    isLoading: isLoading,
    monthGigs: filteredGigs,
    selectedMonth: new Date(selectedMonth),
    setSelectedMonth,
  };
}
