import {
  BandMinimal,
  BandPreviewWithOrder,
  BandWithGenres,
} from "@/domain/Band/Band.type";
import { PlacePreview } from "@/domain/Place/Place.type";
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

export type GigPreview = {
  id: Gig["id"];
  date: Gig["date"];
  endDate: Gig["endDate"];
  imageUrl: Gig["imageUrl"];
  isCanceled: Gig["isCanceled"];
  isSoldOut: Gig["isSoldOut"];
  name: Gig["name"];
  price: Gig["price"];
  slug: Gig["slug"];
  ticketReservationLink: Gig["ticketReservationLink"];
  title: Gig["title"];
  place: PlacePreview;
  bands: BandPreviewWithOrder[];
};

export type GigMinimal = {
  id: Gig["id"];
  title: Gig["title"];
  name: Gig["name"];
  date: Gig["date"];
  endDate: Gig["endDate"];
  bands: BandMinimal[];
};

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
  gig: GigPreview,
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

export type MarkdownGigs = {
  discord: string;
  facebook: string;
};
