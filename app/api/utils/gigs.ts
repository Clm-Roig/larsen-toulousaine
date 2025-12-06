import { BandMinimal, BandPreview } from "@/domain/Band/Band.type";
import { GigMinimal, GigPreview } from "@/domain/Gig/Gig.type";
import { BandsOnGigs, Prisma } from "@prisma/client";

export const gigListOrderBy: Prisma.GigOrderByWithAggregationInput[] = [
  {
    date: Prisma.SortOrder.asc,
  },
  // Gigs with name have priority because festivals (= with name) must appear before gigs
  { name: Prisma.SortOrder.asc },
  { slug: Prisma.SortOrder.asc },
];

export const gigWithBandsAndGenresInclude = {
  place: true,
  bands: {
    include: {
      band: {
        include: {
          genres: true,
        },
      },
    },
  },
};

export const flattenGigBands = <
  T extends
    | (Omit<GigPreview, "bands"> & {
        bands: { band: BandPreview; order: BandsOnGigs["order"] }[];
      })
    | (Omit<GigMinimal, "bands"> & { bands: { band: BandMinimal }[] }),
>(
  gig: T,
) => ({
  ...gig,
  bands: gig?.bands.map((b) => ({ ...b.band, order: b?.order })),
});
