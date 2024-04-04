import {
  Box,
  Flex,
  SegmentedControl,
  Divider,
  SimpleGrid,
  Text,
} from "@mantine/core";
import dayjs from "dayjs";
import { Genre, Place } from "@prisma/client";
import usePreferences from "@/hooks/usePreferences";
import { ViewLayout } from "@/domain/ViewLayout";
import OptionsPopover from "@/components/GigList/ListControls/OptionsPopover";
import DateSelector from "@/components/GigList/ListControls/DateSelector";
import { ViewType } from "@/domain/ViewType";

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
  const { setViewLayout, setViewType, viewLayout, viewType } = usePreferences();

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
      <Flex
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
      </Flex>

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
          onChange={(data) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            setViewLayout(data as ViewLayout);
          }}
          value={viewLayout}
        />
      </Flex>
    </SimpleGrid>
  );
}
