"use client";

import { ActionIcon, Select, SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
} from "../domain/Band/Band.type";
import { searchBands } from "../domain/Band/Band.webService";
import { Band } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { normalizeString } from "@/utils/utils";

type Props = {
  excludedBands?: Array<{ id?: Band["id"]; name: string }>;
  onBandSelect: (selectedBand: BandWithGenres) => void;
  onNoSuggestions?: (currentValue: string) => void;
} & SelectProps;

type BandSuggestion = {
  label: string;
  value: BandWithGenres;
};

const NB_CHAR_TO_LAUNCH_BAND_SEARCH = 2;

export default function BandSelect({
  excludedBands,
  onBandSelect: onSelect,
  onNoSuggestions,
  ...selectProps
}: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebouncedValue(searchInput, 400);
  const [value, setValue] = useState<string | null>("");

  const { data, isLoading, isFetched } = useQuery<
    { bands: BandWithGenresAndGigCount[]; count: number } | null,
    Error
  >({
    queryKey: ["bandSearch", debouncedSearchInput],
    queryFn: async () =>
      debouncedSearchInput?.length >= NB_CHAR_TO_LAUNCH_BAND_SEARCH
        ? await searchBands(debouncedSearchInput)
        : null,
  });

  const { bands } = data || {};

  // Workaround to prevent select to set the searchValue when an option is selected
  useEffect(() => {
    if (value) {
      setValue("");
      setSearchInput("");
    }
  }, [value]);

  const suggestions: BandSuggestion[] | undefined =
    bands
      ?.filter(
        (band) =>
          !excludedBands ||
          excludedBands?.every((excludedBand) => excludedBand.id !== band?.id),
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
    setSearchInput("");
  };

  const searchInputIsASelectedBand = excludedBands?.some(
    (excludedBand) =>
      normalizeString(excludedBand.name) === normalizeString(searchInput),
  );

  const possibilityToAddBandMsg = onNoSuggestions
    ? " Vous pouvez l'ajouter en cliquant sur l'icône + à droite."
    : "";
  const nothingFoundMessage = isLoading
    ? "Chargement..."
    : isFetched && !!debouncedSearchInput
      ? searchInputIsASelectedBand
        ? `Groupe déjà sélectionné pour ce concert.`
        : `Groupe non-référencé. ${possibilityToAddBandMsg}`
      : "";

  const displayAddBandButton =
    !!onNoSuggestions &&
    suggestions !== undefined &&
    !searchInputIsASelectedBand;

  return (
    <Select
      description={"Chercher un groupe existant ou en créer un nouveau"}
      searchable
      withCheckIcon={false}
      data={
        suggestions?.map((s) => ({
          label: s.label,
          value: s.value.id,
        })) || []
      }
      rightSection={
        displayAddBandButton && (
          <ActionIcon
            onClick={() => {
              // TODO: ugly fix by using debouncedSearchInput
              // because searchInput is being cleared just before this onClick is fired
              onNoSuggestions(debouncedSearchInput);
            }}
          >
            <IconPlus />
          </ActionIcon>
        )
      }
      rightSectionPointerEvents="auto"
      onSearchChange={setSearchInput}
      searchValue={searchInput}
      onOptionSubmit={handleOnSelectBand}
      nothingFoundMessage={nothingFoundMessage}
      value={value}
      onChange={setValue}
      {...selectProps}
    />
  );
}
