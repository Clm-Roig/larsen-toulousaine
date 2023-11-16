import {
  Box,
  Flex,
  SegmentedControl,
  Divider,
  SimpleGrid,
} from "@mantine/core";
import dayjs from "dayjs";
import { Genre, Place } from "@prisma/client";
import usePreferences from "@/hooks/usePreferences";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ViewType } from "@/domain/ViewType";
import OptionsPopover from "@/components/GigList/ListControls/OptionsPopover";
import MonthSelector from "@/components/GigList/ListControls/MonthSelector";

type Props = {
  genres: Genre[];
  places: Place[];
  selectedMonth: Date;
  setSelectedMonth: (monthDate: Date) => void;
};

export default function ListControls({
  genres,
  places,
  selectedMonth,
  setSelectedMonth,
}: Props) {
  const { setViewType, viewType } = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const incrementMonth = () => {
    const nextMonth = dayjs(selectedMonth).add(1, "month").toDate();
    setSelectedMonth(nextMonth);
    // Update url search params
    const urlSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    urlSearchParams.set("année", nextMonth.getFullYear() + "");
    urlSearchParams.set("mois", nextMonth.getMonth() + 1 + ""); // getMonth() goes from 0 to 11
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const decrementMonth = () => {
    const previousMonth = dayjs(selectedMonth).subtract(1, "month").toDate();
    setSelectedMonth(previousMonth);
    // Update url search params
    const urlSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    urlSearchParams.set("année", previousMonth.getFullYear() + "");
    urlSearchParams.set("mois", previousMonth.getMonth() + 1 + ""); // getMonth() goes from 0 to 11
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {/* Hidden block to preserve grid layout */}
      <Box style={{ visibility: "hidden" }}></Box>

      <Flex gap="xs" justify="center" align="center">
        <MonthSelector
          decrementMonth={decrementMonth}
          incrementMonth={incrementMonth}
          selectedMonth={selectedMonth}
        />
      </Flex>

      <Flex
        gap="xs"
        justify={{ base: "center", sm: "flex-end" }}
        align="center"
      >
        <OptionsPopover genres={genres} places={places} />
        <Divider orientation="vertical" size="xs" />
        <SegmentedControl
          data={[
            { label: "Grille", value: ViewType.GRID },
            { label: "Liste", value: ViewType.LIST },
          ]}
          onChange={(data) => (data ? setViewType(data as ViewType) : null)}
          value={viewType}
          pl={0}
        />
      </Flex>
    </SimpleGrid>
  );
}
