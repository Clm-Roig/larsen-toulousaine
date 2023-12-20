"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useGigs from "@/hooks/useGigs";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";
import usePreferences from "@/hooks/usePreferences";

export default function WeekGigs() {
  const { preferencesSum } = usePreferences();
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });
  const safePlaces = places?.filter((p) => p.isSafe);

  const { gigs, isLoading } = useGigs({
    startDate: dayjs().startOf("week").toDate(),
    endDate: dayjs().endOf("week").toDate(),
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
      places={safePlaces || []}
    />
  );
}
