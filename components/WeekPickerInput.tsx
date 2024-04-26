import { useState } from "react";
import { DatePickerInput, DatePickerInputProps } from "@mantine/dates";
import dayjs from "@/lib/dayjs";

const startOfWeek = (date: Date) => dayjs(date).startOf("week").toDate();
const endOfWeek = (date: Date) => dayjs(date).endOf("week").toDate();

function isInWeekRange(date: Date, value: Date | null) {
  if (!value) return false;
  const dayJsDate = dayjs(date);
  const endOfWeekValue = endOfWeek(value);
  const startOfWeekValue = startOfWeek(value);
  return (
    (dayJsDate.isBefore(endOfWeekValue) || dayJsDate.isSame(endOfWeekValue)) &&
    (dayJsDate.isAfter(startOfWeekValue) || dayJsDate.isSame(startOfWeekValue))
  );
}

type Props = {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
} & DatePickerInputProps;

function WeekPickerInput({
  selectedDate,
  setSelectedDate,
  ...datePickerInputProps
}: Props) {
  const [hovered, setHovered] = useState<Date | null>(null);

  return (
    <DatePickerInput
      getDayProps={(date) => {
        const isHovered = isInWeekRange(date, hovered);
        const isSelected = isInWeekRange(date, selectedDate);

        const isInRange = isHovered || isSelected;
        return {
          onMouseEnter: () => setHovered(date),
          onMouseLeave: () => setHovered(null),
          inRange: isInRange,
          firstInRange: isInRange && date.getDay() === 1, // Monday
          lastInRange: isInRange && date.getDay() === 0, // Sunday
          selected: isSelected,
          onClick: () => setSelectedDate(date),
        };
      }}
      valueFormatter={({ date }) => {
        if (!date || Array.isArray(date)) return ""; // no need to handle dates array here
        const start = startOfWeek(date);
        const end = endOfWeek(date);
        return `${dayjs(start).format("D MMMM")} - ${dayjs(end).format("D MMMM")}`;
      }}
      value={selectedDate}
      withCellSpacing={false}
      {...datePickerInputProps}
    />
  );
}

export default WeekPickerInput;
