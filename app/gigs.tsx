"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "@/components/GigList";
import useMonthGigs from "@/hooks/useMonthGigs";
import { useEffect } from "react";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { getPlaces } from "@/domain/Place/Place.webService";
import { useQuery } from "@tanstack/react-query";
import usePreferences from "@/hooks/usePreferences";
import useSearchParams from "@/hooks/useSearchParams";
import useYearGigs from "@/hooks/useYearGigs";
import { ViewType } from "@/domain/ViewType";

export default function Gigs() {
  const { searchParams, setSearchParams } = useSearchParams();
  const { displayNotSafePlaces, viewType } = usePreferences();
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });
  const year = searchParams.get("année");
  const monthNb = searchParams.get("mois");

  const currentMonthAndYear =
    year && monthNb
      ? {
          initialYear: Number(year),
          initialMonthNb: Number(monthNb),
        }
      : {
          initialYear: new Date().getFullYear(),
          initialMonthNb: new Date().getMonth() + 1,
        };

  const {
    isLoading: isMonthGigsLoading,
    monthGigs,
    selectedMonth,
    setSelectedMonth,
  } = useMonthGigs();
  const {
    isLoading: isYearGigsLoading,
    yearGigs,
    selectedYear,
    setSelectedYear,
  } = useYearGigs();

  useEffect(() => {
    setSelectedMonth(
      new Date(
        currentMonthAndYear.initialYear,
        currentMonthAndYear.initialMonthNb - 1,
        1,
      ),
    );
  }, [
    currentMonthAndYear.initialMonthNb,
    currentMonthAndYear.initialYear,
    setSelectedMonth,
  ]);

  const filteredPlaces = places?.filter(
    (p) => displayNotSafePlaces || p.isSafe,
  );

  const onSelectedMonthChange = (newMonth: Date) => {
    setSelectedMonth(newMonth);
    const changes = new Map<string, number>([
      ["année", newMonth.getFullYear()],
      ["mois", newMonth.getMonth() + 1], // getMonth() goes from 0 to 11
    ]);
    setSearchParams(changes);
  };

  const isMonthlyView = viewType === ViewType.MONTHLY;

  return (
    <GigList
      dateStep="month"
      genres={genres || []}
      gigs={isMonthlyView ? monthGigs : yearGigs}
      isLoading={isMonthlyView ? isMonthGigsLoading : isYearGigsLoading}
      noGigsFoundMessage={`Aucun concert trouvé pour ${isMonthlyView ? "ce mois-ci" : "cette année-là"} 🙁`}
      places={filteredPlaces || []}
      selectedDate={isMonthlyView ? selectedMonth : selectedYear}
      setSelectedDate={(date: Date) =>
        isMonthlyView ? setSelectedMonth(date) : setSelectedYear(date)
      }
    />
  );
}
