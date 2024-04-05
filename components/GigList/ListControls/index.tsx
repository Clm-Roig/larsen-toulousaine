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
import { ViewLayout } from "@/domain/ViewLayout";
import OptionsPopover from "@/components/GigList/ListControls/OptionsPopover";
import DateSelector from "@/components/GigList/ListControls/DateSelector";
import MonthSelector from "@/components/GigList/ListControls/MonthSelector";
import useSearchParams from "@/hooks/useSearchParams";
import { ViewType } from "@/domain/ViewType";
import YearSelector from "@/components/GigList/ListControls/YearSelector";

type Props = {
  dateStep: "month" | "week";
  genres: Genre[];
  places: Place[];
  selectedDate?: Date;
  setSelectedDate?: (newDate: Date) => void;
};

export default function ListControls({
  dateStep,
  genres,
  places,
  selectedDate,
  setSelectedDate,
}: Props) {
  const { setViewLayout, viewLayout, viewType } = usePreferences();
  const { setSearchParams } = useSearchParams();

  const incrementDate = () => {
    const nextDate = dayjs(selectedDate).add(1, dateStep).toDate();
    updateDate(nextDate);
  };

  const decrementDate = () => {
    const previousDate = dayjs(selectedDate).subtract(1, dateStep).toDate();
    updateDate(previousDate);
  };

  const updateDate = (newDate: Date) => {
    setSelectedDate?.(newDate);
  };

  const updateYear = (newYear: Date) => {
    setSelectedDate?.(newYear);
    const changes = new Map<string, number>([
      ["année", newYear.getFullYear()],
      ["mois", newYear.getMonth() + 1], // getMonth() goes from 0 to 11
    ]);
    setSearchParams(changes);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {/* ===== TODO: Will be implemented later =====*/}
      {/* <Flex
        gap="xs"
        justify={{ base: "center", sm: "flex-start" }}
        align="center"
      >
        <Text>Vue</Text>
        <SegmentedControl
          data={[
            { label: "Mensuelle", value: ViewType.MONTHLY },
            { label: "Annuelle", value: ViewType.YEARLY },
          ]}
          onChange={(data) => (data ? setViewType(data as ViewType) : null)}
          value={viewType}
        />
      </Flex> */}
      {/* Hidden block to preserve grid layout */}
      <Box style={{ visibility: "hidden" }}></Box>

      {selectedDate ? (
        <Flex gap="xs" justify="center" align="center">
          <DateSelector
            dateStep={dateStep}
            decrementDate={decrementDate}
            incrementDate={incrementDate}
            selectedDate={selectedDate}
            onSelectedDateUpdate={updateDate}
          />
        </Flex>
      ) : (
        <>
          {/* Hidden block to preserve grid layout */}
          <Box style={{ visibility: "hidden" }}></Box>
        </>
      )}

      <Flex
        gap="xs"
        justify={{ base: "center", sm: "flex-end" }}
        align="center"
      >
        <OptionsPopover genres={genres} places={places} />
        <Divider orientation="vertical" size="xs" />
        <SegmentedControl
          data={[
            { label: "Grille", value: ViewLayout.GRID },
            { label: "Liste", value: ViewLayout.LIST },
          ]}
          onChange={(data) => (data ? setViewLayout(data as ViewLayout) : null)}
          value={viewLayout}
        />
      </Flex>
    </SimpleGrid>
  );
}
