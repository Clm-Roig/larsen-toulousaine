import dayjs from "dayjs";
import { GigWithBandsAndPlace } from "../../domain/Gig/Gig.type";
import { useCallback, useEffect, useState } from "react";
import { getGigs } from "../../domain/Gig/Gig.webService";

export default function useGigs() {
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs(new Date()).startOf("month").toDate().getTime(),
  );
  const [gigsByMonth, setGigsByMonth] = useState<
    { monthTime: number; gigs: GigWithBandsAndPlace[]; isLoading: boolean }[]
  >([]);

  const updateGigs = (
    monthTime: number,
    monthGigs: GigWithBandsAndPlace[],
    isLoading: boolean,
  ) => {
    setGigsByMonth((prevGigs) => {
      const otherGigs = prevGigs?.filter((g) => g.monthTime !== monthTime);
      return [
        ...otherGigs,
        { monthTime: monthTime, gigs: monthGigs, isLoading: isLoading },
      ];
    });
  };

  const fetchMonthGigs = useCallback(async (monthTime: number) => {
    updateGigs(monthTime, [], true);
    // TODO: fetch prev/next month gigs only if not already fetched
    const selectedMonthStart = dayjs(new Date(monthTime))
      .startOf("month")
      .toDate();
    const selectedMonthEnd = dayjs(new Date(monthTime)).endOf("month").toDate();
    const monthGigs = await getGigs(selectedMonthStart, selectedMonthEnd);
    updateGigs(monthTime, monthGigs, false);
  }, []);

  useEffect(() => {
    const doGetGigs = async () => {
      if (gigsByMonth.every((g) => g.monthTime !== selectedMonth)) {
        await fetchMonthGigs(selectedMonth);
      }
    };
    void doGetGigs();
  }, [fetchMonthGigs, gigsByMonth, selectedMonth]);

  const monthGigs = gigsByMonth.find((g) => g.monthTime === selectedMonth);
  const sortedMonthGigs = {
    monthTime: monthGigs?.monthTime,
    gigs: monthGigs?.gigs.sort(
      (g1, g2) => new Date(g1.date).getTime() - new Date(g2.date).getTime(),
    ),
  };

  return {
    isLoading: monthGigs?.isLoading || false,
    selectedMonth: new Date(selectedMonth),
    setSelectedMonth,
    sortedMonthGigs,
  };
}
