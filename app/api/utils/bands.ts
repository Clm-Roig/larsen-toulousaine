import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { Band, BandsOnGigs } from "@prisma/client";
import { flattenGigBands } from "./gigs";

export const flattenBandGigs = <
  T extends Band & { gigs: ({ gig: GigWithBandsAndPlace } & BandsOnGigs)[] },
>(
  band: T,
): Band & { gigs: GigWithBandsAndPlace[] } => ({
  ...band,
  // @ts-ignore I give up on this very complex typing (but it works! :))
  gigs: band?.gigs.map((g) => flattenGigBands(g.gig)),
});
