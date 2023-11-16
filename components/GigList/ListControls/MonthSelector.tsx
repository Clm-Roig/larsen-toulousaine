import { capitalize } from "@/utils/utils";
import { ActionIcon, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";

type Props = {
  decrementMonth: () => void;
  incrementMonth: () => void;
  selectedMonth: Date;
};

export default function MonthSelector({
  decrementMonth,
  incrementMonth,
  selectedMonth,
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
      <Text fw="bold" w={125} ta="center">
        {capitalize(dayjs(selectedMonth).format("MMMM YYYY"))}
      </Text>
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
