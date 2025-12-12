import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { getMissingDataGigs } from "@/domain/Gig/Gig.webService";
import useFilteredGigs from "@/hooks/useFilteredGigs";
import { useQuery } from "@tanstack/react-query";

export default function useMissingDataGigs() {
  const { data: gigs, isLoading } = useQuery<GigWithBandsAndPlace[]>({
    queryKey: ["gigs/missingData"],
    queryFn: async () => await getMissingDataGigs(),
  });

  const filteredGigs = useFilteredGigs(gigs ?? []);

  return {
    isLoading: isLoading,
    gigs: filteredGigs,
  };
}
