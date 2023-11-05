"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "../../components/GigList";
import useGigs from "./useGigs";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function GigsPage({ genres, places }: Props) {
  const { isLoading, monthGigs, selectedMonth, setSelectedMonth } = useGigs();

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
