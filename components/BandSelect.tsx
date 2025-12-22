"use client";

import { ActionIcon, Select, SelectProps } from "@mantine/core";
import { useEffect, useState } from "react";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
} from "@/domain/Band/Band.type";
import { searchBands } from "@/domain/Band/Band.webService";
import { Band } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { normalizeString } from "@/utils/utils";
import { getSortedGenres } from "@/domain/Band/Band.service";

type Props = {
  excludedBands?: { id?: Band["id"]; name: string }[];
  onBandSelect: (selectedBand: BandWithGenres) => void;
  onNoSuggestions?: (currentValue: string) => void;
} & SelectProps;

interface BandSuggestion {
  label: string;
  value: BandWithGenres;
}

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

  const { data, isLoading, isFetched } = useQuery<{
    bands: BandWithGenresAndGigCount[];
    count: number;
  } | null>({
    queryKey: ["bandSearch", debouncedSearchInput],
    queryFn: async () =>
      debouncedSearchInput.length >= NB_CHAR_TO_LAUNCH_BAND_SEARCH
        ? await searchBands(debouncedSearchInput)
        : null,
  });

  const { bands } = data ?? {};

  // Workaround to prevent select to set the searchValue when an option is selected
  useEffect(() => {
    if (value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue("");
      setSearchInput("");
    }
  }, [value]);

  const suggestions: BandSuggestion[] | undefined = bands?.reduce(
    (suggestions: BandSuggestion[], band) => {
      // if excluded, skip
      if (excludedBands?.some((excludedBand) => excludedBand.id === band.id)) {
        return suggestions;
      }
      // if another band has the same name, add the genres to the label
      const bandWithSameName = bands.find(
        (b) =>
          normalizeString(b.name) === normalizeString(band.name) &&
          b.id !== band.id,
      );
      if (bandWithSameName) {
        return [
          ...suggestions,
          {
            label: `${band.name} (${getSortedGenres(band.genres)
              .map((g) => g.name)
              .join(", ")})`,
            value: band,
          },
        ];
      }
      return [
        ...suggestions,
        {
          label: band.name,
          value: band,
        },
      ];
    },
    [],
  );

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
      description={"Chercher un groupe existant ou en créer un nouveau."}
      searchable
      withCheckIcon={false}
      data={
        suggestions?.map((s) => ({
          label: s.label,
          value: s.value.id,
        })) ?? []
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
