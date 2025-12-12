"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import useMissingDataGigs from "@/hooks/useMissingDataGigs";

export default function InfosManquantesPage() {
  const { displayNotSafePlaces, preferencesSum } = usePreferences();
  const { data: genres } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });
  const filteredPlaces = places?.filter(
    (p) => (displayNotSafePlaces || p.isSafe) && !p.isClosed,
  );

  const { gigs, isLoading } = useMissingDataGigs();

  return (
    <GigList
      dateStep="month"
      displayMissingDataOnly
      genres={genres || []}
      gigs={gigs}
      isLoading={isLoading}
      noGigsFoundMessage={
        `Aucun concert trouvé pour cette semaine 🙁` +
        (preferencesSum > 0
          ? "\nVos options masquent peut-être certains concerts..."
          : "")
      }
      places={filteredPlaces || []}
      withListControls
    />
  );
}
