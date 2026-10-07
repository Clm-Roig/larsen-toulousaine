import { Prisma } from "@prisma/client";

export type OrganizationWithGigCount = Prisma.OrganizationGetPayload<{
  include: {
    _count: {
      select: { gigs: true };
    };
  };
}>;
