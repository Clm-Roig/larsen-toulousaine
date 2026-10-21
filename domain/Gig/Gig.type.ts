import { completeGigInclude, FlattenedGig } from "@/app/api/utils/gigs";
import { BandMinimal, BandPreviewWithOrder } from "@/domain/Band/Band.type";
import { PlacePreview } from "@/domain/Place/Place.type";
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
  organizationId: Gig["organizationId"];
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

export interface MarkdownGigs {
  discord: string;
  facebook: string;
}
