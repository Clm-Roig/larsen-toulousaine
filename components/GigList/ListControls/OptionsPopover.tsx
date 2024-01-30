import GenreSelect from "@/components/GenreSelect";
import NotSafePlaceIcon from "@/components/NotSafePlaceIcon";
import usePreferences from "@/hooks/usePreferences";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Flex,
  Group,
  NumberInput,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { Genre, Place } from "@prisma/client";
import { IconDeselect, IconSelectAll, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function OptionsPopover({ genres, places }: Props) {
  const { status } = useSession();
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);
  const {
    displayNotSafePlaces,
    filteredGenres,
    excludedPlaces,
    grayOutPastGigs,
    maxPrice,
    preferencesSum,
    resetPreferences,
    setDisplayNotSafePlaces,
    setFilteredGenres,
    setExcludedPlaces,
    setGrayOutPastGigs,
    setMaxPrice,
  } = usePreferences();

  const areAllPlacesIncluded = excludedPlaces?.length === 0;

  const handleGenreSelect = (genreIds: string[]) => {
    setFilteredGenres(genres.filter((g) => genreIds.includes(g.id)));
  };

  const handleToggleSelectPlaces = () => {
    if (areAllPlacesIncluded) {
      setExcludedPlaces(places.map((p) => p.id));
    } else {
      setExcludedPlaces([]);
    }
  };

  return (
    <Popover
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      opened={areFiltersOpened}
      onChange={setAreFiltersOpened}
    >
      <Popover.Target>
        <Button onClick={() => setAreFiltersOpened(!areFiltersOpened)}>
          Options{preferencesSum > 0 ? ` (${preferencesSum})` : ""}
        </Button>
      </Popover.Target>

      <Popover.Dropdown maw={350}>
        <Box pos="absolute" top={0} right={0} m={4}>
          <CloseButton onClick={() => setAreFiltersOpened(false)} />
        </Box>
        <Stack gap="sm">
          <Checkbox
            checked={grayOutPastGigs}
            label="Griser les concerts passés"
            onChange={(event) => {
              const checked = event.currentTarget.checked;
              setGrayOutPastGigs(checked);
            }}
          />

          {status === "authenticated" && (
            <Checkbox
              checked={displayNotSafePlaces}
              label="Afficher les concerts dans des lieux non-safes"
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                setDisplayNotSafePlaces(checked);
              }}
            />
          )}

          <NumberInput
            leftSection={
              <ActionIcon size="sm" onClick={() => setMaxPrice("")}>
                <IconX />
              </ActionIcon>
            }
            allowNegative={false}
            suffix="€"
            label="Prix maximum"
            value={maxPrice}
            allowDecimal={false}
            onChange={setMaxPrice}
          />

          <GenreSelect
            label="Genres"
            genres={genres}
            value={filteredGenres.map((g) => g.id)}
            onChange={handleGenreSelect}
            clearable
            // Fix a bug where the Popover is closed when selecting a genre
            // https://github.com/mantinedev/mantine/issues/5173
            comboboxProps={{ withinPortal: false }}
          />

          <Stack gap="xs">
            <Flex justify="space-between" align="center">
              <Text size="sm">Salles</Text>
              <Button
                variant="subtle"
                onClick={handleToggleSelectPlaces}
                rightSection={
                  areAllPlacesIncluded ? <IconDeselect /> : <IconSelectAll />
                }
              >
                {areAllPlacesIncluded ? "Masquer toutes" : "Afficher toutes"}
              </Button>
            </Flex>
            {places.map((place) => (
              <Checkbox
                key={place.id}
                checked={!excludedPlaces.includes(place.id)}
                label={
                  <Group gap={4} style={{ alignItems: "center" }}>
                    <Box>{place.name} </Box>
                    {!place.isSafe && <NotSafePlaceIcon size={14} />}
                  </Group>
                }
                size="xs"
                onChange={(event) => {
                  const checked = event.currentTarget.checked;
                  if (checked) {
                    setExcludedPlaces([
                      ...new Set([
                        ...excludedPlaces.filter(
                          (placeId) => placeId !== place.id,
                        ),
                      ]),
                    ]);
                  } else {
                    setExcludedPlaces([
                      ...new Set([...excludedPlaces, place.id]),
                    ]);
                  }
                }}
              />
            ))}
          </Stack>

          <Button onClick={resetPreferences}>Réinitialiser tout</Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
