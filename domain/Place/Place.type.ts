import { Place, Prisma } from "@prisma/client";

export type PlaceWithGigCount = Prisma.PlaceGetPayload<{
  include: {
    _count: {
      select: { gigs: true };
    };
  };
}>;

export type PlacePreview = {
  id: Place["id"];
  address: Place["address"];
  name: Place["name"];
  city: Place["city"];
  isSafe: Place["isSafe"];
};
