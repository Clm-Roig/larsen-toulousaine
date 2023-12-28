import {
  computeGigSlug,
  getDataFromGigSlug,
  getGigCalendarDescription,
  getGigRSSFeedDescription,
  getGigTitleFromGigSlug,
  getPriceString,
} from "@/domain/Gig/Gig.service";
import { expect, describe, it } from "@jest/globals";
import { gig, gigBands } from "./data";

describe("Gig service", () => {
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
      const date = new Date(
        splittedDate[2],
        splittedDate[1] - 1,
        splittedDate[0],
      );
      expect(date.getDate()).toEqual(gig.date.getDate());
      expect(date.getMonth()).toEqual(gig.date.getMonth()); // displayed month is +1 than date month
      expect(date.getFullYear()).toEqual(gig.date.getFullYear());
      bandNames.forEach((bandName) =>
        expect(gigBands.some((b) => b.name === bandName)).toBe(true),
      );
    });
  });
  describe("getGigTitleFromGigSlug", () => {
    it("get gig title from a gig slug, including gig date and band names", () => {
      const slug = computeGigSlug(gig);
      const gigTitle = getGigTitleFromGigSlug(slug);
      expect(gigTitle).toContain(gig.date.getDate() + "");
      expect(gigTitle).toContain(gig.date.getMonth() + 1 + "");
      expect(gigTitle).toContain(gig.date.getFullYear() + "");
      gigBands.forEach((band) =>
        expect(gigTitle.toLowerCase()).toContain(band.name.toLowerCase()),
      );
    });
  });
  describe("getGigRSSFeedDescription", () => {
    it("get a gig RSS feed description, including various info", () => {
      const rssFeedDescription = getGigRSSFeedDescription(gig);
      expect(rssFeedDescription).toContain(gig.place.name);
      expect(rssFeedDescription).toContain(gig.place.city);
      expect(rssFeedDescription).toContain(gig.price + "");
      expect(rssFeedDescription).toContain(gig.ticketReservationLink);
      gigBands.forEach((band) =>
        expect(rssFeedDescription.toLowerCase()).toContain(
          band.name.toLowerCase(),
        ),
      );
    });
  });
  describe("getGigCalendarDescription", () => {
    it("get a gig calendar description, including various info", () => {
      const calendarDescription = getGigCalendarDescription(gig);
      expect(calendarDescription).toContain(gig.price + "");
      expect(calendarDescription).toContain(gig.ticketReservationLink);
    });
  });
  describe("getPriceString", () => {
    it("get gig price string", () => {
      const priceString = getPriceString(gig.price);
      expect(priceString).toContain(gig.price + "");
    });
    it("get free gig price string, including the words 'libre' and 'gratuit", () => {
      const freeGig = getPriceString(0);
      expect(freeGig).toContain("libre");
      expect(freeGig).toContain("gratuit");
    });
  });
});
