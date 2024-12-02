import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { Band, BandsOnGigs } from "@prisma/client";
import { flattenGigBands } from "./gigs";
import allCountries from "country-region-data/data.json";

export const flattenBandGigs = <
  T extends Band & { gigs: ({ gig: GigWithBandsAndPlace } & BandsOnGigs)[] },
>(
  band: T,
): Band & { gigs: GigWithBandsAndPlace[] } => ({
  ...band,
  // @ts-ignore I give up on this very complex typing (but it works! :))
  gigs: band?.gigs.map((g) => flattenGigBands(g.gig)),
});

export const validateCountryAndRegionCodes = (
  countryCode?: string | null,
  regionCode?: string | null,
): string | undefined => {
  if (!countryCode && !regionCode) return undefined;

  if (
    !!countryCode &&
    allCountries.every((country) => country.countryShortCode !== countryCode)
  ) {
    return "The provided countryCode is not valid.";
  }

  if (regionCode) {
    if (!countryCode) {
      return "You must provide a countryCode to validate the regionCode.";
    }

    if (
      allCountries
        .find((c) => c.countryShortCode === countryCode)
        ?.regions.every((region) => region.shortCode !== regionCode)
    ) {
      return "The provided regionCode was not found in the country regions data.";
    }
  }
};
