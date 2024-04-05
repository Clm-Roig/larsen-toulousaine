import { ViewLayout } from "@/domain/ViewLayout";
import { ViewType } from "@/domain/ViewType";
import { useLocalStorage } from "@mantine/hooks";
import { Genre, Place } from "@prisma/client";
import { useMemo } from "react";

export default function usePreferences() {
  const [displayNotSafePlaces, setDisplayNotSafePlaces] =
    useLocalStorage<boolean>({
      key: "gigList-displayNotSafePlaces",
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
  const [viewLayout, setViewLayout] = useLocalStorage<ViewLayout>({
    key: "gigList-viewLayout",
    defaultValue: ViewLayout.GRID,
  });
  const [viewType, setViewType] = useLocalStorage<ViewType>({
    key: "gigList-viewType",
    defaultValue: ViewType.MONTHLY,
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
    displayNotSafePlaces,
    excludedPlaces: excludedPlaces || [],
    filteredGenres: filteredGenres || [],
    grayOutPastGigs,
    maxPrice,
    preferencesSum,
    resetPreferences,
    setDisplayNotSafePlaces,
    setExcludedPlaces,
    setFilteredGenres,
    setGrayOutPastGigs,
    setMaxPrice,
    setViewLayout,
    setViewType,
    viewLayout,
    viewType,
  };
}
