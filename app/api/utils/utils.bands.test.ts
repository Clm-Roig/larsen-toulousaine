import { validateCountryAndRegionCodes } from "@/app/api/utils/bands";
import { expect, describe, it } from "@jest/globals";

describe("API Bands utils", () => {
  describe("validateCountryAndRegionCodes", () => {
    it("returns no message on empty data", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const testBothValues = (v: any) => {
        expect(validateCountryAndRegionCodes(v)).toBeUndefined();
        expect(validateCountryAndRegionCodes(v, v)).toBeUndefined();
      };
      expect(validateCountryAndRegionCodes()).toBeUndefined();
      testBothValues("");
      testBothValues(null);
      testBothValues(undefined);
    });

    // Country tests
    it("returns no message on appropriate country code", () => {
      expect(validateCountryAndRegionCodes("FR")).toBeUndefined();
      expect(validateCountryAndRegionCodes("US")).toBeUndefined();
    });
    it("returns an appropriate message on invalid countryCode", () => {
      expect(validateCountryAndRegionCodes("ERROR")).toContain("not valid");
      // Region name
      expect(validateCountryAndRegionCodes("OCC")).toContain("not valid");
    });

    // Region tests
    it("returns no message on appropriate country + region code", () => {
      expect(validateCountryAndRegionCodes("FR", "OCC")).toBeUndefined(); // France > Occitanie
      expect(validateCountryAndRegionCodes("US", "AK")).toBeUndefined(); // USA > Alaska
    });
    it("returns an appropriate message on not provided countryCode", () => {
      expect(validateCountryAndRegionCodes(undefined, "OCC")).toContain(
        "provide a countryCode",
      );
      expect(validateCountryAndRegionCodes(null, "OCC")).toContain(
        "provide a countryCode",
      );
    });
    it("returns an appropriate message on regionCode not found in provided countryCode", () => {
      expect(validateCountryAndRegionCodes("FR", "ZZ")).toContain("not found");
      expect(validateCountryAndRegionCodes("MG", "AZERTY")).toContain(
        "not found",
      );
    });
  });
});
