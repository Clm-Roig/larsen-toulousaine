import { BandWithGenres } from "@/domain/Band/Band.type";
import { capitalize as capitalizeStr } from "@/utils/utils";
import { Gig, Prisma } from "@prisma/client";

const gigWithPlace = Prisma.validator<Prisma.GigDefaultArgs>()({
  include: { place: true },
});

export type GigWithBandsAndPlace = Prisma.GigGetPayload<typeof gigWithPlace> & {
  bands: (BandWithGenres & { order: number })[];
};

export enum GigType {
  GIG = "GIG",
  FESTIVAL = "FESTIVAL",
}

export const gigTypeToString = (gigType: GigType): string => {
  let result = "";
  switch (gigType) {
    case GigType.FESTIVAL:
      result = "festival";
      break;
    case GigType.GIG:
      result = "concert";
  }
  return result;
};

export const gigToGigTypeString = (
  gig: Gig,
  options: { capitalize: boolean } = { capitalize: true },
): string => {
  const result = gig.name
    ? gigTypeToString(GigType.FESTIVAL)
    : gigTypeToString(GigType.GIG);
  const { capitalize } = options || {};
  if (capitalize) {
    return capitalizeStr(result);
  }
  return result;
};
