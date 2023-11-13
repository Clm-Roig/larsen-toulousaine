import { Band, Prisma } from "@prisma/client";

const bandWithGenres = Prisma.validator<Prisma.BandDefaultArgs>()({
  include: { genres: true },
});

export type BandWithOrder = Band & { order: number };

export type BandWithGenres = Prisma.BandGetPayload<typeof bandWithGenres>;
