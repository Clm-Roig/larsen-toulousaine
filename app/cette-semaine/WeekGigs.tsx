"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useGigs from "@/hooks/useGigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import { endOf, startOf } from "@/utils/date";

export default function WeekGigs() {
  const { displayNotSafePlaces, preferencesSum } = usePreferences();
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });
  const filteredPlaces = places?.filter(
    (p) => (displayNotSafePlaces || p.isSafe) && !p.isClosed,
  );

  const { gigs, isLoading } = useGigs({
    startDate: startOf("week"),
    endDate: endOf("week"),
  });

  return (
    <GigList
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
    />
  );
}
