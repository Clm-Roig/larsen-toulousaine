import dayjs from "@/lib/dayjs";
import { GigPreview } from "@/domain/Gig/Gig.type";
import { useEffect, useState } from "react";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFilteredGigs from "@/hooks/useFilteredGigs";
import { startOf } from "@/utils/date";
import { GIGS_STALE_TIME_IN_MS } from "@/domain/Gig/constants";

export default function useWeekGigs() {
  const queryClient = useQueryClient();

  const [selectedWeek, setSelectedWeek] = useState(startOf("week"));
  const selectedWeekStart = dayjs(selectedWeek).startOf("week").toDate();
  const selectedWeekEnd = dayjs(selectedWeek).endOf("week").toDate();

  const { data: gigs, isLoading } = useQuery<GigPreview[]>({
    queryKey: [
      "gigs",
      selectedWeekStart.toISOString(),
      selectedWeekEnd.toISOString(),
    ],
    queryFn: async () => await getGigs(selectedWeekStart, selectedWeekEnd),
    staleTime: GIGS_STALE_TIME_IN_MS,
  });

  // Prefetch next week gigs
  useEffect(() => {
    const nextWeekStart = dayjs(selectedWeekStart).add(1, "week").toDate();
    const nextWeekEnd = dayjs(selectedWeekEnd).add(1, "week").toDate();
    void queryClient.prefetchQuery({
      queryKey: [
        "gigs",
        nextWeekStart.toISOString(),
        nextWeekEnd.toISOString(),
      ],
      queryFn: async () => await getGigs(nextWeekStart, nextWeekEnd),
      staleTime: GIGS_STALE_TIME_IN_MS,
    });
  }, [queryClient, selectedWeekEnd, selectedWeekStart]);

  // Prefetch previous week gigs
  useEffect(() => {
    const previousWeekStart = dayjs(selectedWeekStart)
      .subtract(1, "week")
      .toDate();
    const previousWeekEnd = dayjs(selectedWeekEnd).subtract(1, "week").toDate();
    void queryClient.prefetchQuery({
      queryKey: [
        "gigs",
        previousWeekStart.toISOString(),
        previousWeekEnd.toISOString(),
      ],
      queryFn: async () => await getGigs(previousWeekStart, previousWeekEnd),
      staleTime: GIGS_STALE_TIME_IN_MS,
    });
  }, [queryClient, selectedWeekEnd, selectedWeekStart]);

  const filteredGigs = useFilteredGigs(gigs ?? []);

  return {
    isLoading: isLoading,
    selectedWeek: new Date(selectedWeek),
    setSelectedWeek: setSelectedWeek,
    weekGigs: filteredGigs,
  };
}
