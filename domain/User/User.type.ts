import { Prisma } from "@prisma/client";

const userWithGigCount = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    _count: {
      select: { gigs: true },
    },
  },
});

export type UserWithGigCount = Prisma.UserGetPayload<typeof userWithGigCount>;
