import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { BandWithGenres } from "../domain/Band/Band.type";
import { searchBandsByName } from "../domain/Band/Band.webService";
import { Band } from "@prisma/client";

type Props = {
  excludedBandIds?: Array<Band["id"]>;
  onBandSelect: (selectedBand: BandWithGenres) => void;
};

type BandSuggestion = {
  label: string;
  value: BandWithGenres;
};

const NB_CHAR_TO_LAUNCH_BAND_SEARCH = 2;

export default function BandSelect({
  excludedBandIds,
  onBandSelect: onSelect,
}: Props) {
  const [suggestions, setSuggestions] = useState<BandSuggestion[]>([]);
  const [searchedBandInput, setSearchedBandInput] = useState("");
  const [value, setValue] = useState<string | null>("");
  const [isLoadingBandSuggestions, setIsLoadingBandSuggestions] =
    useState(false);

  // Workaround to prevent select to set the searchValue when an option is selected
  useEffect(() => {
    if (value) {
      setValue("");
      setSearchedBandInput("");
    }
  }, [value]);

  const handleOnSearchBandChange = async (value: string) => {
    setSearchedBandInput(value);
    let newSuggestions: BandSuggestion[] = [];
    if (value && value.length >= 2) {
      setSuggestions([]);
      setIsLoadingBandSuggestions(true);
      newSuggestions = (await searchBandsByName(value))
        .filter(
          (band) =>
            !excludedBandIds ||
            excludedBandIds?.every(
              (excludedBandId) => excludedBandId !== band?.id,
            ),
        )
        .map((band) => ({
          label: band.name,
          value: band,
        }));
      setIsLoadingBandSuggestions(false);
    }
    setSuggestions(newSuggestions);
  };

  const handleOnSelectBand = (bandId: string) => {
    const foundBand = suggestions.find((s) => s.value.id === bandId)?.value;
    if (foundBand) {
      onSelect(foundBand);
      setSuggestions([]);
    }
    setSearchedBandInput("");
  };

  return (
    <Select
      label={"Chercher un groupe existant"}
      searchable
      withCheckIcon={false}
      data={
        suggestions.map((s) => ({
          label: s.label,
          value: s.value.id,
        })) || []
      }
      searchValue={searchedBandInput}
      onSearchChange={handleOnSearchBandChange}
      onOptionSubmit={handleOnSelectBand}
      nothingFoundMessage={
        isLoadingBandSuggestions
          ? "Chargement..."
          : searchedBandInput?.length >= NB_CHAR_TO_LAUNCH_BAND_SEARCH
          ? "Groupe non-référencé ou déjà sélectionné pour ce concert"
          : ""
      }
      value={value}
      onChange={setValue}
    />
  );
}
