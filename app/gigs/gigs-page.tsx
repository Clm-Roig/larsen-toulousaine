"use client";

import GigList from "../../components/GigList";
import useGigs from "./useGigs";

export default function GigsPage() {
  const { isLoading, selectedMonth, setSelectedMonth, sortedMonthGigs } =
    useGigs();

  return (
    <GigList
      gigs={sortedMonthGigs.gigs}
      isLoading={isLoading}
      selectedMonth={selectedMonth}
      setSelectedMonth={(date: Date) => setSelectedMonth(date.getTime())}
    />
  );
}
