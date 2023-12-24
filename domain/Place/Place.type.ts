import { Prisma } from "@prisma/client";

const placeWithGigCount = Prisma.validator<Prisma.PlaceDefaultArgs>()({
  include: {
    _count: {
      select: { gigs: true },
    },
  },
});
export type PlaceWithGigCount = Prisma.PlaceGetPayload<
  typeof placeWithGigCount
>;
