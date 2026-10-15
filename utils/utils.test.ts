import {
  boolean3ChoicesFormValueToBool,
  boolean3ChoicesToFormValue,
  capitalize,
  formatFrenchPrice,
  isImageUrl,
  isMobile,
  isValidUrl,
  normalizeString,
  removeParametersFromUrl,
  sleep,
} from "@/utils/utils";
import { expect, describe, it, jest, afterEach } from "@jest/globals";

describe("Utility Functions", () => {
  describe("sleep", () => {
    it("should resolve after the specified milliseconds", async () => {
      jest.useFakeTimers();
      const promise = sleep(1000);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
      jest.useRealTimers();
    });
  });

  describe("isValidUrl", () => {
    it("should return true for valid absolute URLs", () => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000/path?query=1")).toBe(true);
    });

    it("should return false for invalid URLs, null, or undefined", () => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });
  });

  describe("isImageUrl", () => {
    it("should return true for URLs ending with valid image extensions", () => {
      expect(isImageUrl("https://example.com/image.jpg")).toBe(true);
      expect(isImageUrl("https://example.com/photo.PNG")).toBe(true); // Case insensitive due to toLowerCase() in cleanUrl
      expect(isImageUrl("https://example.com/graphic.webp")).toBe(true);
    });

    it("should return true for URLs with query parameters if the path ends with a valid extension", () => {
      expect(
        isImageUrl("https://example.com/image.jpg?width=800&quality=90"),
      ).toBe(true);
    });

    it("should return false for invalid extensions or non-image URLs", () => {
      expect(isImageUrl("https://example.com/document.pdf")).toBe(false);
      expect(isImageUrl("https://example.com/image.jpg.txt")).toBe(false);
      expect(isImageUrl("https://example.com")).toBe(false);
      expect(isImageUrl("not-a-url")).toBe(false);
      expect(isImageUrl(null)).toBe(false);
    });
  });

  describe("capitalize", () => {
    it("should capitalize the first letter of a string", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("world World")).toBe("World World");
    });

    it("should handle single characters and empty strings", () => {
      expect(capitalize("a")).toBe("A");
      expect(capitalize("")).toBe("");
    });
  });

  describe("normalizeString", () => {
    it("should remove diacritics and convert to lowercase", () => {
      expect(normalizeString("Éléphant")).toBe("elephant");
      expect(normalizeString("Ça va, ?")).toBe("ca va, ?");
      expect(normalizeString("ÀÉÎÔÙ")).toBe("aeiou");
    });
  });

  describe("isMobile", () => {
    const originalNavigator = window.navigator;

    afterEach(() => {
      // Restore original navigator if modified
      Object.defineProperty(window, "navigator", {
        value: originalNavigator,
        configurable: true,
      });
    });

    it("should return true for mobile user agents", () => {
      const mobileUAs = [
        "Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)",
      ];

      mobileUAs.forEach((ua) => {
        Object.defineProperty(window, "navigator", {
          value: { userAgent: ua },
          configurable: true,
        });
        expect(isMobile()).toBeTruthy();
      });
    });

    it("should return false for desktop user agents", () => {
      const desktopUA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      Object.defineProperty(window, "navigator", {
        value: { userAgent: desktopUA },
        configurable: true,
      });
      expect(isMobile()).toBeFalsy();
    });
  });

  describe("removeParametersFromUrl", () => {
    it("should strip query parameters from a URL", () => {
      expect(
        removeParametersFromUrl("https://example.com/path?foo=bar&baz=qux"),
      ).toBe("https://example.com/path");
      expect(removeParametersFromUrl("https://example.com/path")).toBe(
        "https://example.com/path",
      );
    });
  });

  describe("formatFrenchPrice", () => {
    it("should format numbers into French currency without decimals when whole", () => {
      const formatted1 = formatFrenchPrice(1500);
      expect(formatted1).toContain("1");
      expect(formatted1).toContain("500");
      expect(formatted1).toContain("€");
      expect(formatted1).not.toContain(",00");

      const formatted2 = formatFrenchPrice(42);
      expect(formatted2).toContain("42");
      expect(formatted2).toContain("€");
    });
  });

  describe("boolean3ChoicesFormValueToBool", () => {
    it("should convert form string values to correct boolean or null", () => {
      expect(boolean3ChoicesFormValueToBool("true")).toBe(true);
      expect(boolean3ChoicesFormValueToBool("false")).toBe(false);
      expect(boolean3ChoicesFormValueToBool("")).toBe(null);
    });

    it("should throw an error for unexpected values", () => {
      expect(() => boolean3ChoicesFormValueToBool("maybe")).toThrow(
        "Unexpected value: maybe",
      );
    });
  });

  describe("boolean3ChoicesToFormValue", () => {
    it("should convert boolean or null/undefined to form string values", () => {
      expect(boolean3ChoicesToFormValue(true)).toBe("true");
      expect(boolean3ChoicesToFormValue(false)).toBe("false");
      expect(boolean3ChoicesToFormValue(null)).toBe("");
      expect(boolean3ChoicesToFormValue(undefined)).toBe("");
    });
  });
});
