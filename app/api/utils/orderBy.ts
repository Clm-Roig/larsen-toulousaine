import { Prisma } from "@prisma/client";

interface SortOptions {
  sortBy?: string | string[];
  order?: Prisma.SortOrder | Prisma.SortOrder[];
  validFields: string[];
  defaultSort?:
    | Record<string, Prisma.SortOrder>
    | Record<string, Record<string, Prisma.SortOrder>>;
}

/**
 * Usage: /api/places?sortBy=name&sortBy=placeSize&order=desc&order=asc
 * Will give: [{name: "desc", placeSize: "asc"}]
 *
 * It also handle sorting by  relation aggregate value (example: "gigs._count")
 */
export function getPrismaOrderByFromRequest({
  sortBy,
  order,
  validFields,
  defaultSort,
}: SortOptions) {
  const orderBy: Array<Record<string, unknown>> = [];

  const sortFields = Array.isArray(sortBy) ? sortBy : sortBy ? [sortBy] : [];
  const sortOrders = Array.isArray(order) ? order : order ? [order] : [];

  sortFields.forEach((field, index) => {
    const direction = sortOrders[index] === "asc" ? "asc" : "desc";

    if (!field) return;

    if (field.includes(".")) {
      const [relation, aggregate] = field.split(".");
      if (
        validFields.includes(field) &&
        ["_count", "_avg", "_sum", "_min", "_max"].includes(aggregate)
      ) {
        orderBy.push({
          [relation]: {
            [aggregate]: direction,
          },
        });
      }
    } else {
      if (validFields.includes(field)) {
        orderBy.push({ [field]: direction });
      }
    }
  });

  if (orderBy.length === 0 && defaultSort) {
    orderBy.push(defaultSort);
  }

  return orderBy;
}
