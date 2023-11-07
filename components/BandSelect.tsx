"use client";

import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { BandWithGenres } from "../domain/Band/Band.type";
import { searchBandsByName } from "../domain/Band/Band.webService";
import { Band } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";

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
  const [searchQueryInput, setSearchQueryInput] = useState("");
  const [debouncedSearchQueryInput] = useDebouncedValue(searchQueryInput, 400);
  const [value, setValue] = useState<string | null>("");

  const {
    data: foundBands,
    isLoading,
    isFetched,
  } = useQuery<BandWithGenres[] | null, Error>({
    queryKey: ["bandSearch", debouncedSearchQueryInput],
    queryFn: async () =>
      debouncedSearchQueryInput?.length > NB_CHAR_TO_LAUNCH_BAND_SEARCH
        ? await searchBandsByName(debouncedSearchQueryInput)
        : null,
  });

  // Workaround to prevent select to set the searchValue when an option is selected
  useEffect(() => {
    if (value) {
      setValue("");
      setSearchQueryInput("");
    }
  }, [value]);

  const suggestions: BandSuggestion[] | undefined =
    foundBands
      ?.filter(
        (band) =>
          !excludedBandIds ||
          excludedBandIds?.every(
            (excludedBandId) => excludedBandId !== band?.id,
          ),
      )
      .map((band) => ({
        label: band.name,
        value: band,
      })) || undefined;

  const handleOnSelectBand = (bandId: string) => {
    const foundBand = suggestions?.find((s) => s.value.id === bandId)?.value;
    if (foundBand) {
      onSelect(foundBand);
    }
    setSearchQueryInput("");
  };

  return (
    <Select
      label={"Chercher un groupe existant"}
      searchable
      withCheckIcon={false}
      data={
        suggestions?.map((s) => ({
          label: s.label,
          value: s.value.id,
        })) || []
      }
      onSearchChange={setSearchQueryInput}
      searchValue={searchQueryInput}
      onOptionSubmit={handleOnSelectBand}
      nothingFoundMessage={
        isLoading
          ? "Chargement..."
          : isFetched && suggestions?.length === 0
          ? "Groupe non-référencé ou déjà sélectionné pour ce concert"
          : ""
      }
      value={value}
      onChange={setValue}
    />
  );
}
