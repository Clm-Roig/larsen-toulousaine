"use client";

import { useEffect, useState } from "react";
import GigList from "../../components/GigList";
import { getGigs } from "../../domain/Gig/Gig.webService";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";

export default function GigsPage() {
  const [monthDate, setMonthDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [gigs, setGigs] = useState<GigWithBandsAndPlace[] | undefined>(
    undefined,
  );

  useEffect(() => {
    const doGetGigs = async () => {
      setIsLoading(true);
      const newGigs = await getGigs(monthDate);
      setIsLoading(false);
      setGigs(newGigs);
    };
    void doGetGigs();
  }, [monthDate]);

  const sortedGigs = gigs?.sort(
    (gig1, gig2) =>
      new Date(gig1.date).getTime() - new Date(gig2.date).getTime(),
  );

  return (
    <GigList
      gigs={sortedGigs}
      isLoading={isLoading}
      monthDate={monthDate}
      setMonthDate={setMonthDate}
    />
  );
}
