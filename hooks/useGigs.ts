import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { getGigs } from "@/domain/Gig/Gig.webService";
import useSortedGigs from "@/hooks/useSortedGigs";
import { useQuery } from "@tanstack/react-query";

export default function useGigs({
  endDate,
  startDate,
}: {
  endDate: Date;
  startDate: Date;
}) {
  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: ["gigs", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => await getGigs(startDate, endDate),
  });

  const sortedGigs = useSortedGigs(gigs || []);

  return {
    isLoading: isLoading,
    gigs: sortedGigs,
  };
}
