import { Place, Prisma } from "@prisma/client";

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

export type PlacePreview = {
  id: Place["id"];
  address: Place["address"];
  name: Place["name"];
  city: Place["city"];
  isSafe: Place["isSafe"];
};
