import GenreSelect from "@/components/GenreSelect";
import UnsafeIcon, { UnsafeType } from "@/components/UnsafeIcon";
import { MAIN_CITY } from "@/domain/Place/constants";
import usePreferences from "@/hooks/usePreferences";
import {
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
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { Genre, Place } from "@prisma/client";
import {
  IconDeselect,
  IconHomeCancel,
  IconRefresh,
  IconSelectAll,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function OptionsPopover({ genres, places }: Props) {
  const { status } = useSession();
  const theme = useMantineTheme();
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

      <Popover.Dropdown maw={350} mah="50%" style={{ overflowY: "scroll" }}>
        <Stack gap="sm">
          <Box pos="absolute" top={0} right={0} m={4}>
            <CloseButton onClick={() => setAreFiltersOpened(false)} />
          </Box>

          <Button
            leftSection={<IconRefresh size={20} />}
            onClick={resetPreferences}
            w="fit-content"
            style={{
              visibility: preferencesSum === 0 ? "hidden" : "visible",
            }}
            size="xs"
          >
            Réinitialiser
          </Button>

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
            leftSection={<CloseButton onClick={() => setMaxPrice("")} />}
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
            {places
              .sort((p1) => (p1.isClosed ? 1 : -1))
              .map((place) => (
                <Checkbox
                  key={place.id}
                  checked={!excludedPlaces.includes(place.id)}
                  label={
                    <Group gap={4} style={{ alignItems: "center" }}>
                      <Box>
                        {place.name}
                        {place.city !== MAIN_CITY ? ` (${place.city})` : ""}
                      </Box>
                      {place.isClosed && (
                        <Tooltip label="Lieu fermé">
                          <IconHomeCancel
                            color={theme.colors.orange[9]}
                            size={14}
                          />
                        </Tooltip>
                      )}
                      {!place.isSafe && (
                        <UnsafeIcon unsafeType={UnsafeType.PLACE} size={14} />
                      )}
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
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
