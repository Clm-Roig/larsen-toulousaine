import { useLocalStorage } from "@mantine/hooks";
import { Genre, Place } from "@prisma/client";

export default function usePreferences() {
  const [excludedGenres, setExcludedGenres] = useLocalStorage<Genre[]>({
    key: "gigList-excludedGenres",
    defaultValue: [],
  });
  const [excludedPlaces, setExcludedPlaces] = useLocalStorage<Place["id"][]>({
    key: "gigList-excludedPlaces",
    defaultValue: [],
  });

  return {
    excludedGenres: excludedGenres || [],
    excludedPlaces: excludedPlaces || [],
    setExcludedGenres,
    setExcludedPlaces,
  };
}
