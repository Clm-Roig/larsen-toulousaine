import { expect, describe, it } from "@jest/globals";
import { getBandNames } from "../Band.service";
import { V_SEPARATOR } from "@/utils/utils";

describe("Band service", () => {
  describe("getBandNames", () => {
    it("get band names, separated by the defined separator", () => {
      const bandsWithOrder = [
        { name: "The Cosmic Keys", order: 2 },
        { name: "Wailing Asteroids", order: 1 },
        { name: "The Space Cadets", order: 3 },
      ];
      let expectedBandNames = `Wailing Asteroids${V_SEPARATOR}The Cosmic Keys${V_SEPARATOR}The Space Cadets`;
      let bandNames = getBandNames(bandsWithOrder);
      expect(bandNames).toBe(expectedBandNames);

      const bandsWithoutOrder = [
        { name: "The Cosmic Keys" },
        { name: "Wailing Asteroids" },
        { name: "The Space Cadets" },
      ];
      expectedBandNames = `The Cosmic Keys${V_SEPARATOR}The Space Cadets${V_SEPARATOR}Wailing Asteroids`;
      bandNames = getBandNames(bandsWithoutOrder);
      expect(bandNames).toBe(expectedBandNames);
    });
  });
});
