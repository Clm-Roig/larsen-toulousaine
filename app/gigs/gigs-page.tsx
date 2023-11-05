"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "../../components/GigList";
import useGigs from "./useGigs";
import { useEffect } from "react";
import usePreferences from "../../hooks/usePreferences";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function GigsPage({ genres, places }: Props) {
  const { isLoading, monthGigs, selectedMonth, setSelectedMonth } = useGigs();
  const { selectedPlaces, setSelectedPlaces } = usePreferences();
  useEffect(() => {
    if (selectedPlaces === undefined) {
      setSelectedPlaces(places.map((p) => p.id));
    }
  }, [places, selectedPlaces, setSelectedPlaces]);

  return (
    <GigList
      genres={genres}
      gigs={monthGigs}
      isLoading={isLoading}
      places={places}
      selectedMonth={selectedMonth}
      setSelectedMonth={(date: Date) => setSelectedMonth(date.getTime())}
    />
  );
}
