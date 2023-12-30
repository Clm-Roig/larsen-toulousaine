import { useMemo } from "react";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import usePreferences from "./usePreferences";

export default function useSortedGigs(gigs: GigWithBandsAndPlace[]) {
  const { displayNotSafePlaces, filteredGenres, excludedPlaces, maxPrice } =
    usePreferences();

  const sortedGigs = useMemo(
    () =>
      gigs
        // Genre(s) filtering
        ?.filter(
          (gig) =>
            gig.bands.length === 0 ||
            filteredGenres?.length === 0 ||
            gig.bands.some((band) =>
              band.genres.some(
                (genre) => filteredGenres?.map((g) => g.id).includes(genre.id),
              ),
            ),
        )
        // Place(s) filtering
        .filter(
          (gig) =>
            !excludedPlaces?.includes(gig.placeId) &&
            (displayNotSafePlaces || gig.place.isSafe),
        )
        // Price filtering
        .filter(
          (gig) =>
            !gig.price ||
            (!maxPrice && maxPrice !== 0) ||
            (!Number.isNaN(maxPrice) && gig.price <= Number(maxPrice)),
        ),
    [excludedPlaces, filteredGenres, gigs, maxPrice, displayNotSafePlaces],
  );

  return sortedGigs;
}
