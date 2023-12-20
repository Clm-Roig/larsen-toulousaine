import dayjs from "@/lib/dayjs";

export const hasPassed = (date: Date) => {
  return dayjs(date).endOf("day").isBefore(Date.now());
};

export const serializeDate = (date: Date) => dayjs(date).format("dd-MM-YYYY");
