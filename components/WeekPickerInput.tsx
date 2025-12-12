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
        const dateObj = new Date(date);
        const isHovered = isInWeekRange(dateObj, hovered);
        const isSelected = isInWeekRange(dateObj, selectedDate);

        const isInRange = isHovered || isSelected;
        return {
          onMouseEnter: () => {
            setHovered(dateObj);
          },
          onMouseLeave: () => {
            setHovered(null);
          },
          inRange: isInRange,
          firstInRange: isInRange && dateObj.getDay() === 1, // Monday
          lastInRange: isInRange && dateObj.getDay() === 0, // Sunday
          selected: isSelected,
          onClick: () => {
            setSelectedDate(dateObj);
          },
        };
      }}
      valueFormatter={({ date }) => {
        if (!date || Array.isArray(date)) return ""; // no need to handle dates array here
        const dateObj = new Date(date);
        const start = startOfWeek(dateObj);
        const end = endOfWeek(dateObj);
        return `${dayjs(start).format("D MMMM")} - ${dayjs(end).format("D MMMM")}`;
      }}
      value={selectedDate}
      withCellSpacing={false}
      {...datePickerInputProps}
    />
  );
}

export default WeekPickerInput;
