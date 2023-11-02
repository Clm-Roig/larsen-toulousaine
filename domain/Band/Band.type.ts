import { Prisma } from "@prisma/client";

const bandWithGenres = Prisma.validator<Prisma.BandDefaultArgs>()({
  include: { genres: true },
});

export type BandWithGenres = Prisma.BandGetPayload<typeof bandWithGenres>;
