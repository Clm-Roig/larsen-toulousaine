import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { allBands, allPlaces, allUsers } from "@/tests/data";
import { expect, describe, it } from "@jest/globals";

describe("Gig service", () => {
  describe("computeGigSlug", () => {
    it("contains band names & gig date", () => {
      const gigBands = allBands
        .slice(0, 2)
        .map((b, idx) => ({ ...b, order: idx + 1 }));
      const gig: GigWithBandsAndPlace = {
        id: "oiqdkjioaz8549849d8",
        bands: gigBands,
        date: new Date(),
        place: allPlaces[0],
        createdAt: new Date(),
        updatedAt: new Date(),
        isCanceled: false,
        title: null,
        authorId: allUsers[0].id,
        description: null,
        placeId: allPlaces[0].id,
        slug: "random slug",
        imageUrl: null,
        ticketReservationLink: null,
      };
      const slug = computeGigSlug(gig);
      expect(slug).not.toContain(" ");
      expect(slug).toContain(gig.date.getDate() + "");
      expect(slug).toContain(gig.date.getMonth() + 1 + "");
      expect(slug).toContain(gig.date.getFullYear() + "");
      gigBands.forEach((band) =>
        expect(slug).toContain(band.name.toLowerCase().replaceAll(" ", "-")),
      );
    });
  });
});
