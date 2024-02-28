import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { getMissingDataGigs } from "@/domain/Gig/Gig.webService";
import useSortedGigs from "@/hooks/useSortedGigs";
import { useQuery } from "@tanstack/react-query";

export default function useMissingDataGigs() {
  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[], Error>({
    queryKey: ["gigs/missingData"],
    queryFn: async () => await getMissingDataGigs(),
  });

  const sortedGigs = useSortedGigs(gigs || []);

  return {
    isLoading: isLoading,
    gigs: sortedGigs,
  };
}
