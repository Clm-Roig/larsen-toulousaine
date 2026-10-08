import { Prisma } from "@prisma/client";

export const gigListOrderBy: Prisma.GigOrderByWithAggregationInput[] = [
  {
    date: Prisma.SortOrder.asc,
  },
  // Gigs with name have priority because festivals (= with name) must appear before gigs
  { name: Prisma.SortOrder.asc },
  { slug: Prisma.SortOrder.asc },
];

export const completeGigInclude = {
  author: {
    select: {
      id: true,
      pseudo: true,
    },
  },
  organization: true,
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
} satisfies Prisma.GigInclude;

export type RawGigFromPrisma = Prisma.GigGetPayload<{
  include: typeof completeGigInclude;
}>;

export type FlattenedGig<
  TGig extends { bands: { band: object; order: number }[] },
> = Omit<TGig, "bands"> & {
  bands: (TGig["bands"][number]["band"] & { order: number })[];
};

export const flattenGigBands = <
  TGig extends { bands: { band: object; order: number }[] },
>(
  gig: TGig,
): FlattenedGig<TGig> => {
  const { bands, ...rest } = gig;
  return {
    ...rest,
    bands: bands.map((b) => ({ ...b.band, order: b.order })),
  } as FlattenedGig<TGig>;
};
