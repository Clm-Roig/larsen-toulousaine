import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import { ViewType } from "@/domain/ViewType";
import { useLocalStorage } from "@mantine/hooks";
import { Genre, Place } from "@prisma/client";
import { useMemo } from "react";

export default function usePreferences() {
  const [displayNotSafeGigs, setDisplayNotSafeGigs] = useLocalStorage<boolean>({
    key: "gigList-displayNotSafeGigs",
    defaultValue: false,
  });
  const [filteredGenres, setFilteredGenres] = useLocalStorage<Genre[]>({
    key: "gigList-filteredGenres",
    defaultValue: [],
  });
  const [filteredOrganizations, setFilteredOrganizations] = useLocalStorage<
    OrganizationWithGigCount[]
  >({
    key: "gigList-filteredOrganizations",
    defaultValue: [],
  });
  const [excludedPlaces, setExcludedPlaces] = useLocalStorage<Place["id"][]>({
    key: "gigList-excludedPlaces",
    defaultValue: [],
  });
  const [grayOutPastGigs, setGrayOutPastGigs] = useLocalStorage<boolean>({
    key: "gigList-grayOutPastGigs",
    defaultValue: false,
  });
  const [maxPrice, setMaxPrice] = useLocalStorage<number | string>({
    key: "gigList-maxPrice",
    defaultValue: "",
  });
  const [viewType, setViewType] = useLocalStorage<ViewType>({
    key: "gigList-viewType",
    defaultValue: ViewType.GRID,
  });

  const resetPreferences = () => {
    setFilteredGenres([]);
    setFilteredOrganizations([]);
    setExcludedPlaces([]);
    setGrayOutPastGigs(false);
    setMaxPrice("");
  };

  const preferencesSum = useMemo(
    () =>
      filteredGenres.length +
      filteredOrganizations.length +
      (!!maxPrice || maxPrice === 0 ? 1 : 0) +
      excludedPlaces.length,
    [
      excludedPlaces.length,
      filteredGenres.length,
      filteredOrganizations.length,
      maxPrice,
    ],
  );

  return {
    displayNotSafeGigs,
    excludedPlaces,
    filteredGenres,
    filteredOrganizations,
    grayOutPastGigs,
    maxPrice,
    preferencesSum,
    resetPreferences,
    setDisplayNotSafeGigs,
    setExcludedPlaces,
    setFilteredGenres,
    setFilteredOrganizations,
    setGrayOutPastGigs,
    setMaxPrice,
    setViewType,
    viewType,
  };
}
