"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import useMissingDataGigs from "@/hooks/useMissingDataGigs";
import { genresQuery, placesQuery } from "@/domain/queries";

export default function InfosManquantesPage() {
  const { displayNotSafeGigs, preferencesSum } = usePreferences();
  const { data: genres } = useQuery<Genre[]>(genresQuery);
  const { data: places } = useQuery<Place[]>(placesQuery);
  const filteredPlaces = places?.filter(
    (p) => (displayNotSafeGigs || p.isSafe) && !p.isClosed,
  );

  const { gigs, isLoading } = useMissingDataGigs();

  return (
    <GigList
      dateStep="month"
      displayMissingDataOnly
      genres={genres ?? []}
      gigs={gigs}
      isLoading={isLoading}
      noGigsFoundMessage={
        `Aucun concert trouvé pour cette semaine 🙁` +
        (preferencesSum > 0
          ? "\nVos options masquent peut-être certains concerts..."
          : "")
      }
      places={filteredPlaces ?? []}
      withListControls
    />
  );
}
