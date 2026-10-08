import { completeGigInclude, FlattenedGig } from "@/app/api/utils/gigs";
import { BandMinimal, BandPreviewWithOrder } from "@/domain/Band/Band.type";
import { PlacePreview } from "@/domain/Place/Place.type";
import { capitalize as capitalizeStr } from "@/utils/utils";
import { Gig, Prisma } from "@prisma/client";

type RawCompleteGig = Prisma.GigGetPayload<{
  include: typeof completeGigInclude;
}>;

export type CompleteGig = FlattenedGig<RawCompleteGig>;

export enum GigType {
  GIG = "GIG",
  FESTIVAL = "FESTIVAL",
}

export enum GigDateDisplayMode {
  DEFAULT,
  WITH_YEAR,
}

export interface GigPreview {
  id: Gig["id"];
  date: Gig["date"];
  endDate: Gig["endDate"];
  imageUrl: Gig["imageUrl"];
  isCanceled: Gig["isCanceled"];
  isSoldOut: Gig["isSoldOut"];
  name: Gig["name"];
  price: Gig["price"];
  slug: Gig["slug"];
  sourceUrl: Gig["sourceUrl"];
  ticketReservationLink: Gig["ticketReservationLink"];
  title: Gig["title"];
  place: PlacePreview;
  bands: BandPreviewWithOrder[];
}

export interface GigMinimal {
  id: Gig["id"];
  bands: BandMinimal[];
  date: Gig["date"];
  endDate: Gig["endDate"];
  name: Gig["name"];
  slug: Gig["slug"];
  title: Gig["title"];
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
  gig: GigPreview,
  options: { capitalize: boolean } = { capitalize: true },
): string => {
  const result = gig.name
    ? gigTypeToString(GigType.FESTIVAL)
    : gigTypeToString(GigType.GIG);
  const { capitalize } = options;
  if (capitalize) {
    return capitalizeStr(result);
  }
  return result;
};

export interface MarkdownGigs {
  discord: string;
  facebook: string;
}
