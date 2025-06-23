import { expect, describe, it } from "@jest/globals";
import { getPrismaOrderByFromRequest } from "@/app/api/utils/orderBy";

describe("getPrismaOrderBy", () => {
  const validFields = ["name", "price", "createdAt"];

  it("returns valid sorting with a single field", () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: "name",
      order: "asc",
      validFields,
      defaultSort: { createdAt: "desc" },
    });

    expect(result).toEqual([{ name: "asc" }]);
  });

  it("ignores invalid fields and returns the default sort", () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: "invalidField",
      order: "asc",
      validFields,
      defaultSort: { createdAt: "desc" },
    });

    expect(result).toEqual([{ createdAt: "desc" }]);
  });

  it("handles multi-field sorting", () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: ["price", "name"],
      order: ["desc", "asc"],
      validFields,
      defaultSort: { createdAt: "desc" },
    });

    expect(result).toEqual([{ price: "desc" }, { name: "asc" }]);
  });

  it('defaults to "desc" when order is invalid', () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: "name",
      order: "invalid" as never,
      validFields,
      defaultSort: { createdAt: "desc" },
    });

    expect(result).toEqual([{ name: "desc" }]);
  });

  it("returns an empty array when no valid sort field and no default sort", () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: "invalid",
      order: "asc",
      validFields,
    });

    expect(result).toEqual([]);
  });

  it("uses default sort when no parameters are provided", () => {
    const result = getPrismaOrderByFromRequest({
      validFields,
      defaultSort: { createdAt: "desc" },
    });

    expect(result).toEqual([{ createdAt: "desc" }]);
  });
  it("supports sorting by nested aggregate fields (e.g. gigs._count)", () => {
    const result = getPrismaOrderByFromRequest({
      sortBy: "gigs._count",
      order: "desc",
      validFields: ["gigs._count", "name"],
      defaultSort: { name: "asc" },
    });

    expect(result).toEqual([
      {
        gigs: {
          _count: "desc",
        },
      },
    ]);
  });
});
