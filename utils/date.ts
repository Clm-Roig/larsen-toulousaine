import dayjs from "dayjs";

export const hasPassed = (date: Date) => {
  return dayjs(date).endOf("day").isBefore(Date.now());
};
