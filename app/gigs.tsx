"use client";
import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useMonthGigs from "@/hooks/useMonthGigs";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import usePreferences from "@/hooks/usePreferences";
import useSearchParams from "@/hooks/useSearchParams";

export default function Gigs() {
  const { searchParams, setSearchParams } = useSearchParams();
  const { displayNotSafeGigs } = usePreferences();

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["genres"],
    queryFn: getGenres,
    staleTime: 60 * 60 * 15, // 15min
  });

  const { data: places = [] } = useQuery<Place[]>({
    queryKey: ["places"],
    queryFn: getPlaces,
    staleTime: 60 * 60 * 15, // 15min
  });

  const { isLoading, monthGigs, setSelectedMonth, selectedMonth } =
    useMonthGigs();

  const filteredPlaces = useMemo(
    () => places.filter((p) => displayNotSafeGigs || p.isSafe),
    [places, displayNotSafeGigs],
  );

  const onSelectedMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
    const changes = new Map<string, number>([
      ["année", newMonth.getFullYear()],
      ["mois", newMonth.getMonth() + 1], // getMonth() goes from 0 to 11
    ]);
    setSearchParams(changes);
  };

  useEffect(() => {
    const year = searchParams.get("année");
    const monthNb = searchParams.get("mois");

    if (year && monthNb) {
      setSelectedMonth(new Date(Number(year), Number(monthNb) - 1, 1));
    } else {
      const now = new Date();
      setSelectedMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    }
  }, [searchParams, setSelectedMonth]);

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
