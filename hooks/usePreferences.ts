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
    setExcludedPlaces([]);
    setGrayOutPastGigs(false);
    setMaxPrice("");
  };

  const preferencesSum = useMemo(
    () =>
      filteredGenres.length +
      (!!maxPrice || maxPrice === 0 ? 1 : 0) +
      excludedPlaces.length,
    [excludedPlaces.length, filteredGenres.length, maxPrice],
  );

  return {
    displayNotSafeGigs,
    excludedPlaces,
    filteredGenres,
    grayOutPastGigs,
    maxPrice,
    preferencesSum,
    resetPreferences,
    setDisplayNotSafeGigs,
    setExcludedPlaces,
    setFilteredGenres,
    setGrayOutPastGigs,
    setMaxPrice,
    setViewType,
    viewType,
  };
}
