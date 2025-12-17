"use client";
import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useMonthGigs from "@/hooks/useMonthGigs";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import usePreferences from "@/hooks/usePreferences";
import useSearchParams from "@/hooks/useSearchParams";

export default function Gigs() {
  const { searchParams, setSearchParams } = useSearchParams();
  const { displayNotSafePlaces } = usePreferences();

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 60 * 60 * 5, // 5min
  });

  const { data: places = [] } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getPlaces,
    staleTime: 60 * 60 * 5, // 5min
  });

  const selectedMonth = useMemo(() => {
    const year = searchParams.get("année");
    const monthNb = searchParams.get("mois");

    if (year && monthNb) {
      return new Date(Number(year), Number(monthNb) - 1, 1);
    }

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [searchParams]);

  const { isLoading, monthGigs, setSelectedMonth } = useMonthGigs();

  const filteredPlaces = useMemo(
    () => places.filter((p) => displayNotSafePlaces || p.isSafe),
    [places, displayNotSafePlaces],
  );

  const onSelectedMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
    const changes = new Map<string, number>([
      ["année", newMonth.getFullYear()],
      ["mois", newMonth.getMonth() + 1],
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
