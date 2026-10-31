import { Organization, Prisma } from "@prisma/client";
import { GigPreview } from "../Gig/Gig.type";

export type OrganizationWithGigCount = Prisma.OrganizationGetPayload<{
  include: {
    _count: {
      select: { gigs: true };
    };
  };
}>;

export type OrganizationWithGigs = Organization & {
  gigs: GigPreview[];
};
