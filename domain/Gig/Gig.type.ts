import { Prisma } from "@prisma/client";

const gigWithBands = Prisma.validator<Prisma.GigDefaultArgs>()({
  include: { bands: { include: { genres: true } } },
});
const gigWithPlace = Prisma.validator<Prisma.GigDefaultArgs>()({
  include: { place: true },
});
const gigWithAuthor = Prisma.validator<Prisma.GigDefaultArgs>()({
  include: { author: true },
});
export type GigWithBandsAndPlace = Prisma.GigGetPayload<
  typeof gigWithBands & typeof gigWithPlace
>;

export type GigWithAuthor = Prisma.GigGetPayload<typeof gigWithAuthor>;
