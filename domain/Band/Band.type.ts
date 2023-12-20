import { Band, Prisma } from "@prisma/client";

const bandWithGenres = Prisma.validator<Prisma.BandDefaultArgs>()({
  include: { genres: true },
});

export type BandWithOrder = Band & { order: number };

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
