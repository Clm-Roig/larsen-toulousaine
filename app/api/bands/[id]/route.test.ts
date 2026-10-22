import { PUT, DELETE, GET } from "./route";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";
import { flattenBandGigs } from "@/app/api/utils/bands";
import { Band } from "@prisma/client";
import { beforeEach, expect, it, vi } from "vitest";
import { describe } from "vitest";

// Force prismMock initialization before vi.mock() hoisting
const { prismaMock, resetPrismaMock } = await vi.hoisted(async () => {
  return await import("@/tests/prismaMock");
});

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

vi.mock("@/app/api/utils/bands", () => ({
  validateCountryAndRegionCodes: vi.fn().mockReturnValue(null),
  flattenBandGigs: vi.fn((band: unknown) => ({
    ...(band as Record<string, unknown>),
    flattened: true,
  })),
}));

describe("API Route: /api/bands/[id]", () => {
  const mockUserSession = { user: { id: "user-1", email: "admin@larsen.fr" } };

  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });
  // --------------------------------------------------------------------------
  // PUT /api/bands/[id]
  // --------------------------------------------------------------------------
  describe("PUT", () => {
    it("should reject update if user is unauthenticated (401)", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(null);

      const request = new NextRequest("http://localhost/api/bands/band-1", {
        method: "PUT",
        body: JSON.stringify({ id: "band-1" }),
      });

      const response = await PUT(request);
      expect(response.status).toBe(401);

      expect(prismaMock.band.update).not.toHaveBeenCalled();
    });

    it("should force LOCAL_COUNTRY_CODE and LOCAL_REGION_CODE when isLocal is true", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(
        mockUserSession as never,
      );
      prismaMock.band.update.mockResolvedValueOnce({} as Band);

      const requestBody = {
        id: "band-1",
        name: "Obsydian Underground",
        isLocal: true,
        countryCode: "US",
        regionCode: "NY",
        genres: ["genre-1"],
      };

      const request = new NextRequest("http://localhost/api/bands/band-1", {
        method: "PUT",
        body: JSON.stringify(requestBody),
      });

      await PUT(request);

      expect(prismaMock.band.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "band-1" },
          data: expect.objectContaining({
            isLocal: true,
            countryCode: LOCAL_COUNTRY_CODE,
            regionCode: LOCAL_REGION_CODE,
          } as Record<string, unknown>),
        } as Record<string, unknown>),
      );
    });
  });

  // --------------------------------------------------------------------------
  // DELETE /api/bands/[id]
  // --------------------------------------------------------------------------
  describe("DELETE", () => {
    it("should return domain-specific error if band is linked to a gig (Code P2003, HTTP error = 409)", async () => {
      vi.mocked(getServerSession).mockResolvedValueOnce(
        mockUserSession as never,
      );

      const prismaFKError = {
        code: "P2003",
        meta: { field_name: "BandsOnGigs_bandId_fkey (index)" },
      };

      vi.mocked(prismaMock.band.delete).mockRejectedValueOnce(prismaFKError);

      const params = Promise.resolve({ id: "band-1" });
      const request = new NextRequest("http://localhost/api/bands/band-1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params });
      expect(response.status).toBe(409);
    });
  });

  // --------------------------------------------------------------------------
  // GET /api/bands/[id]
  // --------------------------------------------------------------------------
  describe("GET", () => {
    it("should process data through flattenBandGigs before returning", async () => {
      const mockRawBand = {
        id: "band-1",
        name: "Test Band",
        gigs: [{ gig: { id: "gig-1" } }],
      };

      vi.mocked(prismaMock.band.findFirst).mockResolvedValueOnce(
        mockRawBand as never,
      );

      const params = Promise.resolve({ id: "band-1" });
      const request = new NextRequest("http://localhost/api/bands/band-1");

      const response = await GET(request, { params });
      const body: unknown = await response.json();

      expect(flattenBandGigs).toHaveBeenCalledWith(mockRawBand);
      expect(body).toHaveProperty("flattened", true);
    });

    it("should return a 404 when band is not found", async () => {
      vi.mocked(prismaMock.band.findFirst).mockResolvedValueOnce(null);

      const params = Promise.resolve({ id: "unknown-band" });
      const request = new NextRequest(
        "http://localhost/api/bands/unknown-band",
      );

      const response = await GET(request, { params });

      expect(response.status).toBe(404);
    });
  });
});
