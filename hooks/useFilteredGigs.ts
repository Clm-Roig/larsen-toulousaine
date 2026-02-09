import { useMemo } from "react";
import { GigPreview } from "@/domain/Gig/Gig.type";
import usePreferences from "./usePreferences";

export default function useFilteredGigs(gigs: GigPreview[]) {
  const { displayNotSafeGigs, filteredGenres, excludedPlaces, maxPrice } =
    usePreferences();

  const filteredGigs = useMemo(
    () =>
      gigs
        // Genre(s) filtering
        .filter(
          (gig) =>
            gig.bands.length === 0 ||
            filteredGenres.length === 0 ||
            gig.bands.some((band) =>
              band.genres.some((genre) =>
                filteredGenres.map((g) => g.id).includes(genre.id),
              ),
            ),
        )
        // Place(s) + band(s) filtering
        .filter(
          (gig) =>
            !excludedPlaces.includes(gig.place.id) &&
            (displayNotSafeGigs || gig.place.isSafe) &&
            (displayNotSafeGigs || gig.bands.every((b) => b.isSafe)),
        )
        // Price filtering
        .filter(
          (gig) =>
            !gig.price ||
            (!maxPrice && maxPrice !== 0) ||
            (!Number.isNaN(maxPrice) && gig.price <= Number(maxPrice)),
        ),
    [excludedPlaces, filteredGenres, gigs, maxPrice, displayNotSafeGigs],
  );

  return filteredGigs;
}
