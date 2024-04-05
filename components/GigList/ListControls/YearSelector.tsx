import { ActionIcon } from "@mantine/core";
import { YearPickerInput } from "@mantine/dates";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
  decrementYear: () => void;
  incrementYear: () => void;
  selectedYear: Date;
  onSelectedYearUpdate: (date: Date) => void;
};

export default function YearSelector({
  decrementYear,
  incrementYear,
  selectedYear,
  onSelectedYearUpdate,
}: Props) {
  return (
    <>
      <ActionIcon
        onClick={decrementYear}
        aria-label="Décrémenter mois"
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>
      <YearPickerInput
        value={selectedYear}
        onChange={onSelectedYearUpdate}
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
        onClick={incrementYear}
        aria-label="Incrémenter mois"
        size="lg"
      >
        <IconChevronRight />
      </ActionIcon>
    </>
  );
}
