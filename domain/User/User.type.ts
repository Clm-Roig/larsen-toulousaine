import { Prisma } from "@prisma/client";

export type UserWithGigCount = Prisma.UserGetPayload<{
  include: {
    _count: {
      select: { gigs: true };
    };
  };
}>;
