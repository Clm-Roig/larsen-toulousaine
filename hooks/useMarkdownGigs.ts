import { GIGS_STALE_TIME_IN_MS } from "@/domain/Gig/constants";
import { MarkdownGigs } from "@/domain/Gig/Gig.type";
import { getMarkdownGigs } from "@/domain/Gig/Gig.webService";
import { Permission } from "@/domain/permissions";
import useHasPermission from "@/hooks/useHasPermission";
import { useQuery } from "@tanstack/react-query";

export default function useMarkdownGigs({
  endDate,
  startDate,
}: {
  endDate: Date;
  startDate: Date;
}) {
  const canSeeWeeklyGigsMarkdown = useHasPermission(
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  );

  const { data: gigs, isLoading } = useQuery<MarkdownGigs, Error>({
    queryKey: ["markdownGigs", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => await getMarkdownGigs(startDate, endDate),
    enabled: canSeeWeeklyGigsMarkdown,
    staleTime: GIGS_STALE_TIME_IN_MS,
  });

  return {
    isLoading: isLoading,
    gigs: gigs,
  };
}
