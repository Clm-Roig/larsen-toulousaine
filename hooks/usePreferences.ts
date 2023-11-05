import { useLocalStorage } from "@mantine/hooks";
import { Genre, Place } from "@prisma/client";

export default function usePreferences() {
  const [excludedGenres, setExcludedGenres] = useLocalStorage<Genre[]>({
    key: "gigList-excludedGenres",
    defaultValue: [],
  });
  const [selectedPlaces, setSelectedPlaces] = useLocalStorage<Place["id"][]>({
    key: "gigList-selectedPlaces",
    defaultValue: [],
  });

  return {
    excludedGenres: excludedGenres || [],
    selectedPlaces: selectedPlaces || [],
    setExcludedGenres,
    setSelectedPlaces,
  };
}
