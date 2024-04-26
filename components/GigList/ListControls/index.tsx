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
import { ViewType } from "@/domain/ViewType";
import OptionsPopover from "@/components/GigList/ListControls/OptionsPopover";
import DateSelector from "@/components/GigList/ListControls/DateSelector";

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
  const { setViewType, viewType } = usePreferences();

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

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
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
            { label: "Grille", value: ViewType.GRID },
            { label: "Liste", value: ViewType.LIST },
          ]}
          onChange={(data) => (data ? setViewType(data as ViewType) : null)}
          value={viewType}
        />
      </Flex>
    </SimpleGrid>
  );
}
