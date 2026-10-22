import {
  computeGigSlug,
  getDataFromGigSlug,
  getGigCalendarDescription,
  getGigRSSFeedDescription,
  getGigTitleFromGigSlug,
  formatGigPrice,
} from "@/domain/Gig/Gig.service";
import { gig, gigBands } from "./data";
import { describe, it, expect } from "vitest";

describe("Gig service", () => {
  describe("computeGigSlug", () => {
    it("contains band names & gig date, and normalizes strings (spaces, accents, lowercase)", () => {
      const mockGigWithAccents = {
        ...gig,
        name: null,
        bands: [{ name: "Obsydían / Éther & Ox" }], // Band name with diacritic and "&" symbol
      };

      const slug = computeGigSlug(mockGigWithAccents);

      // Global verification
      expect(slug).not.toContain(" ");
      expect(slug).not.toContain("í");
      expect(slug).not.toContain("é");
      expect(slug).toContain("obsydian-|-ether-and-ox");

      // Date verification
      expect(slug).toContain(gig.date.getDate().toString().padStart(2, "0"));
      expect(slug).toContain(gig.date.getFullYear().toString());
    });
  });
  describe("getDataFromGigSlug", () => {
    it("get data from a gig slug", () => {
      const slug = computeGigSlug(gig);
      const data = getDataFromGigSlug(slug);
      const { bandNames, date: rawStrDate } = data;
      const splittedDate = rawStrDate.split("-").map((s) => Number(s));
      const date = new Date(
        splittedDate[2],
        splittedDate[1] - 1,
        splittedDate[0],
      );
      expect(date.getDate()).toEqual(gig.date.getDate());
      expect(date.getMonth()).toEqual(gig.date.getMonth()); // displayed month is +1 than date month
      expect(date.getFullYear()).toEqual(gig.date.getFullYear());
      bandNames.forEach((bandName) => {
        expect(gigBands.some((b) => b.name === bandName)).toBe(true);
      });
    });
  });
  describe("getGigTitleFromGigSlug", () => {
    it("get gig title from a gig slug, including gig date and band names", () => {
      const slug = computeGigSlug(gig);
      const gigTitle = getGigTitleFromGigSlug(slug);
      expect(gigTitle).toContain(gig.date.getDate().toString());
      expect(gigTitle).toContain((gig.date.getMonth() + 1).toString());
      expect(gigTitle).toContain(gig.date.getFullYear().toString());
      gigBands.forEach((band) => {
        expect(gigTitle.toLowerCase()).toContain(band.name.toLowerCase());
      });
    });
  });
  describe("getGigRSSFeedDescription", () => {
    it("get a gig RSS feed description, including various info", () => {
      const rssFeedDescription = getGigRSSFeedDescription(gig);
      expect(rssFeedDescription).toContain(gig.place.name);
      expect(rssFeedDescription).toContain(gig.place.city);
      expect(rssFeedDescription).toContain(gig.price?.toString());
      expect(rssFeedDescription).toContain(gig.ticketReservationLink);
      gigBands.forEach((band) => {
        expect(rssFeedDescription.toLowerCase()).toContain(
          band.name.toLowerCase(),
        );
      });
    });
  });
  describe("getGigCalendarDescription", () => {
    it("get a gig calendar description, including various info", () => {
      const calendarDescription = getGigCalendarDescription(gig);
      expect(calendarDescription).toContain(gig.price?.toString());
      expect(calendarDescription).toContain(gig.ticketReservationLink);
    });
  });
  describe("formatGigPrice", () => {
    it("get gig price string", () => {
      const prefix = "myprefix";
      const priceString = formatGigPrice(prefix, gig.price);
      expect(priceString).toContain(gig.price?.toString());
      expect(priceString).toContain(prefix);
    });
    it("get free gig price string, including the words 'libre' and 'offert", () => {
      const freeGig = formatGigPrice("Prix : ", 0);
      expect(freeGig).toContain("libre");
      expect(freeGig).toContain("offert");
    });
  });
});
