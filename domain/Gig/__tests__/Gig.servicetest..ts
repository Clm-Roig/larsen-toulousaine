import { computeGigSlug, getDataFromGigSlug } from "@/domain/Gig/Gig.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { allBands, allPlaces, allUsers } from "@/tests/data";
import { expect, describe, it } from "@jest/globals";

describe("Gig service", () => {
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
    price: null,
  };

  describe("computeGigSlug", () => {
    it("contains band names & gig date", () => {
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
  describe("getDataFromGigSlug", () => {
    it("get data from a gig slug", () => {
      const slug = computeGigSlug(gig);
      const data = getDataFromGigSlug(slug);
      const { bandNames, date: rawStrDate } = data;
      const splittedDate = rawStrDate.split("-").map((s) => Number(s));
      const date = new Date(splittedDate[2], splittedDate[1], splittedDate[0]);
      expect(date.getDate()).toEqual(gig.date.getDate());
      expect(date.getMonth() - 1).toEqual(gig.date.getMonth()); // displayed month is +1 than date month
      expect(date.getFullYear()).toEqual(gig.date.getFullYear());
      bandNames.forEach((bandName) =>
        expect(gigBands.some((b) => b.name === bandName)).toBe(true),
      );
    });
  });
});
