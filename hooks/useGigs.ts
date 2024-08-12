import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { getGigs } from "@/domain/Gig/Gig.webService";
import useFilteredGigs from "@/hooks/useFilteredGigs";
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

  const filteredGigs = useFilteredGigs(gigs || []);

  return {
    isLoading: isLoading,
    gigs: filteredGigs,
  };
}
