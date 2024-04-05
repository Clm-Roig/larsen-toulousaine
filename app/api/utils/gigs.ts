import { Band, BandsOnGigs, Gig, Prisma } from "@prisma/client";

export const gigListOrderBy: Prisma.GigOrderByWithAggregationInput[] = [
  {
    date: Prisma.SortOrder.asc,
  },
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
  T extends Gig & { bands: ({ band: Band } & BandsOnGigs)[] },
>(
  gig: T,
) => ({
  ...gig,
  bands: gig?.bands.map((b) => ({ ...b.band, order: b.order })),
});
