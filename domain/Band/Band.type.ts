import { Band, Genre, Prisma, BandsOnGigs } from "@prisma/client";
import { GigWithBandsAndPlace } from "../Gig/Gig.type";

const bandWithGenres = Prisma.validator<Prisma.BandDefaultArgs>()({
  include: { genres: true },
});

export type BandWithOrder = Band & { order: number };

export type BandMinimal = {
  id: Band["id"];
  name: Band["name"];
};

export type BandPreview = {
  id: Band["id"];
  genres: Genre[];
  isSafe: Band["isSafe"];
  isATribute: Band["isATribute"];
  name: Band["name"];
};

export type BandPreviewWithOrder = BandPreview & {
  order: BandsOnGigs["order"];
};

const bandWithGigCount = Prisma.validator<Prisma.BandDefaultArgs>()({
  include: {
    _count: {
      select: { gigs: true },
    },
  },
});
export type BandWithGenres = Prisma.BandGetPayload<typeof bandWithGenres>;
export type BandWithGenresAndGigCount = Prisma.BandGetPayload<
  typeof bandWithGenres & typeof bandWithGigCount
>;
export type BandWithGenresAndGigs = Prisma.BandGetPayload<
  typeof bandWithGenres
> & { gigs: GigWithBandsAndPlace[] };
