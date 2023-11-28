import { ActionIcon } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
  decrementMonth: () => void;
  incrementMonth: () => void;
  selectedMonth: Date;
  onSelectedMonthUpdate: (date: Date) => void;
};

export default function MonthSelector({
  decrementMonth,
  incrementMonth,
  selectedMonth,
  onSelectedMonthUpdate,
}: Props) {
  return (
    <>
      <ActionIcon
        onClick={decrementMonth}
        aria-label="Décrémenter mois"
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>
      <MonthPickerInput
        value={selectedMonth}
        onChange={onSelectedMonthUpdate}
        fw="bold"
        styles={{
          input: {
            textTransform: "capitalize",
            textAlign: "center",
          },
        }}
        w={150}
      />
      <ActionIcon
        onClick={incrementMonth}
        aria-label="Incrémenter mois"
        size="lg"
      >
        <IconChevronRight />
      </ActionIcon>
    </>
  );
}
