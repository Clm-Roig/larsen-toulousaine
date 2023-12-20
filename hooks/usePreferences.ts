import { ViewType } from "@/domain/ViewType";
import { useLocalStorage } from "@mantine/hooks";
import { Genre, Place } from "@prisma/client";
import { useMemo } from "react";

export default function usePreferences() {
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
    () => filteredGenres?.length + (maxPrice ? 1 : 0) + excludedPlaces?.length,
    [excludedPlaces?.length, filteredGenres?.length, maxPrice],
  );

  return {
    filteredGenres: filteredGenres || [],
    excludedPlaces: excludedPlaces || [],
    grayOutPastGigs,
    maxPrice,
    preferencesSum,
    resetPreferences,
    setFilteredGenres,
    setExcludedPlaces,
    setGrayOutPastGigs,
    setMaxPrice,
    setViewType,
    viewType,
  };
}
