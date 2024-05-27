import { GIGS_STALE_TIME_IN_MS } from "@/domain/Gig/constants";
import { MarkdownGigs } from "@/domain/Gig/Gig.type";
import { getMarkdownGigs } from "@/domain/Gig/Gig.webService";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function useMarkdownGigs({
  endDate,
  startDate,
}: {
  endDate: Date;
  startDate: Date;
}) {
  const { data } = useSession();

  const { data: gigs, isLoading } = useQuery<MarkdownGigs, Error>({
    queryKey: ["markdownGigs", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => await getMarkdownGigs(startDate, endDate),
    enabled: !!data?.user,
    staleTime: GIGS_STALE_TIME_IN_MS,
  });

  return {
    isLoading: isLoading,
    gigs: gigs,
  };
}
