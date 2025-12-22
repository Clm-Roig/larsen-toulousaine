import { Band, Genre, Prisma, BandsOnGigs } from "@prisma/client";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";

export type BandWithOrder = Band & { order: number };

export interface BandMinimal {
  id: Band["id"];
  name: Band["name"];
}

export interface BandPreview {
  id: Band["id"];
  genres: Genre[];
  isATribute: Band["isATribute"];
  isLocal: Band["isLocal"];
  isSafe: Band["isSafe"];
  name: Band["name"];
}

export type BandPreviewWithOrder = BandPreview & {
  order: BandsOnGigs["order"];
};

export type BandWithGenres = Prisma.BandGetPayload<{
  include: { genres: true };
}>;

export type BandWithGenresAndGigCount = Prisma.BandGetPayload<{
  include: {
    genres: true;
    _count: {
      select: { gigs: true };
    };
  };
}>;

export type BandWithGenresAndGigs = BandWithGenres & {
  gigs: GigWithBandsAndPlace[];
};
