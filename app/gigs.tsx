"use client";

import { Genre, Place } from "@prisma/client";
import GigList from "../components/GigList";
import useGigs from "./useGigs";
import { useSearchParams } from "next/navigation";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function Gigs({ genres = [], places = [] }: Props) {
  const searchParams = useSearchParams();
  const year = searchParams.get("année");
  const monthNb = searchParams.get("mois");

  const { isLoading, monthGigs, selectedMonth, setSelectedMonth } = useGigs(
    year && monthNb
      ? {
          initialYear: Number(year),
          initialMonthNb: Number(monthNb),
        }
      : undefined,
  );

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
