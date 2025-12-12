import WeekPickerInput from "@/components/WeekPickerInput";
import { ActionIcon } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface Props {
  dateStep: "week" | "month";
  decrementDate: () => void;
  incrementDate: () => void;
  selectedDate: Date;
  onSelectedDateUpdate: (date: Date) => void;
}

export default function DateSelector({
  dateStep,
  decrementDate,
  incrementDate,
  selectedDate,
  onSelectedDateUpdate,
}: Props) {
  return (
    <>
      <ActionIcon
        onClick={decrementDate}
        aria-label="Décrémenter date"
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>
      {dateStep === "month" && (
        <MonthPickerInput
          value={selectedDate}
          onChange={(date) => {
            if (date) {
              onSelectedDateUpdate(new Date(date));
            }
          }}
          styles={{
            input: {
              textTransform: "capitalize",
              textAlign: "center",
            },
          }}
          w={150}
        />
      )}
      {dateStep === "week" && (
        <WeekPickerInput
          styles={{
            input: {
              textAlign: "center",
            },
          }}
          selectedDate={selectedDate}
          setSelectedDate={onSelectedDateUpdate}
        />
      )}
      <ActionIcon
        onClick={incrementDate}
        aria-label="Incrémenter date"
        size="lg"
      >
        <IconChevronRight />
      </ActionIcon>
    </>
  );
}
