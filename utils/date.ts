import dayjs from "@/lib/dayjs";

export const hasPassed = (date: Date) =>
  dayjs(date).endOf("day").isBefore(Date.now());

export const startOf = (
  temporalUnit: "year" | "month" | "week" | "day",
): Date => dayjs().startOf(temporalUnit).toDate();

export const endOf = (temporalUnit: "year" | "month" | "week" | "day"): Date =>
  dayjs().endOf(temporalUnit).toDate();

export const serializeDate = (date: Date) => dayjs(date).format("dd-MM-YYYY");
