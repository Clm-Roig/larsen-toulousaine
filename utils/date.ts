import dayjs from "@/lib/dayjs";

export type TemporalUnit = "year" | "month" | "week" | "day";

export const hasPassed = (date: Date) =>
  dayjs(date).endOf("day").isBefore(Date.now());

export const startOf = (temporalUnit: TemporalUnit, date?: Date): Date =>
  dayjs(date).startOf(temporalUnit).toDate();

export const endOf = (temporalUnit: TemporalUnit, date?: Date): Date =>
  dayjs(date).endOf(temporalUnit).toDate();

export const serializeDate = (date: Date) => dayjs(date).format("dd-MM-YYYY");

export const isInWeekRange = (date: Date, value: Date | null) => {
  if (!value) return false;
  const dayJsDate = dayjs(date);
  const endOfWeekValue = endOf("week", value);
  const startOfWeekValue = startOf("week", value);
  return (
    (dayJsDate.isBefore(endOfWeekValue) || dayJsDate.isSame(endOfWeekValue)) &&
    (dayJsDate.isAfter(startOfWeekValue) || dayJsDate.isSame(startOfWeekValue))
  );
};
