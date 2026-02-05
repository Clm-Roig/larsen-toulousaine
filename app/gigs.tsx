"use client";
import GigList from "@/components/GigList";
import useMonthGigs from "@/hooks/useMonthGigs";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import useSearchParams from "@/hooks/useSearchParams";
import { Genre, Place } from "@prisma/client";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";

interface Props {
  initialMonth: Date;
}

export default function Gigs({ initialMonth }: Props) {
  const { setSearchParams } = useSearchParams();
  const { displayNotSafePlaces } = usePreferences();

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 60 * 60 * 1, // 1h
  });
  const { data: places = [] } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getPlaces,
    staleTime: 60 * 60 * 1, // 1h
  });

  const { isLoading, monthGigs, selectedMonth, setSelectedMonth } =
    useMonthGigs(initialMonth);

  const filteredPlaces = places.filter((p) => displayNotSafePlaces || p.isSafe);

  const onSelectedMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
    const changes = new Map<string, number>([
      ["année", newMonth.getFullYear()],
      ["mois", newMonth.getMonth() + 1], // getMonth() goes from 0 to 11
    ]);
    setSearchParams(changes);
  };

  return (
    <GigList
      dateStep="month"
      genres={genres}
      gigs={monthGigs}
      isLoading={isLoading}
      noGigsFoundMessage="Aucun concert trouvé pour ce mois-ci 🙁"
      places={filteredPlaces}
      selectedDate={selectedMonth}
      setSelectedDate={onSelectedMonthChange}
      withListControls
    />
  );
}
