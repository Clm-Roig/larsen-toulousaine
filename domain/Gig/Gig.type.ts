import { BandWithGenres } from "@/domain/Band/Band.type";
import { Prisma } from "@prisma/client";

const gigWithPlace = Prisma.validator<Prisma.GigDefaultArgs>()({
  include: { place: true },
});

export type GigWithBandsAndPlace = Prisma.GigGetPayload<typeof gigWithPlace> & {
  bands: (BandWithGenres & { order: number })[];
};
