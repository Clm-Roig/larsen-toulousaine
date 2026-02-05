import dayjs from "@/lib/dayjs";
import { GigPreview } from "@/domain/Gig/Gig.type";
import { useEffect, useState } from "react";
import { getGigs } from "@/domain/Gig/Gig.webService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useFilteredGigs from "@/hooks/useFilteredGigs";
import { startOf } from "@/utils/date";
import { GIGS_STALE_TIME_IN_MS } from "@/domain/Gig/constants";

export default function useMonthGigs(initialMonth?: Date) {
  const queryClient = useQueryClient();

  const [selectedMonth, setSelectedMonth] = useState(
    initialMonth ?? startOf("month"),
  );
  const monthStart = dayjs(selectedMonth).startOf("month").toDate();
  const monthEnd = dayjs(selectedMonth).endOf("month").toDate();
  const { data: gigs = [], isLoading } = useQuery<GigPreview[]>({
    queryKey: ["gigs", monthStart.toISOString(), monthEnd.toISOString()],
    queryFn: async () => await getGigs(monthStart, monthEnd),
    staleTime: GIGS_STALE_TIME_IN_MS,
  });

  // Prefetch next & previous month gigs
  useEffect(() => {
    const prefetch = async (offset: number) => {
      const start = dayjs(monthStart).add(offset, "month").toDate();
      const end = dayjs(monthEnd).add(offset, "month").toDate();

      await queryClient.prefetchQuery({
        queryKey: ["gigs", start.toISOString(), end.toISOString()],
        queryFn: () => getGigs(start, end),
        staleTime: GIGS_STALE_TIME_IN_MS,
      });
    };

    void prefetch(-1);
    void prefetch(1);
  }, [monthStart, monthEnd, queryClient]);

  const filteredGigs = useFilteredGigs(gigs);
  return {
    isLoading: isLoading,
    monthGigs: filteredGigs,
    selectedMonth: new Date(selectedMonth),
    setSelectedMonth,
  };
}
