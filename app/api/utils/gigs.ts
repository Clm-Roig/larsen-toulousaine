import { Band, BandsOnGigs, Gig, Prisma } from "@prisma/client";

export const gigListOrderBy: Prisma.GigOrderByWithAggregationInput[] = [
  {
    date: Prisma.SortOrder.asc,
  },
  { slug: Prisma.SortOrder.asc },
];

export const gigWithBandsAndGenresInclude = {
  author: true,
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

export const flattenGigBands = (
  gig: Gig & { bands: ({ band: Band } & BandsOnGigs)[] },
) => ({
  ...gig,
  bands: gig?.bands.map((b) => ({ ...b.band, order: b.order })),
});
