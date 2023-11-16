import GenreSelect from "@/components/GenreSelect";
import usePreferences from "@/hooks/usePreferences";
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  CloseButton,
  NumberInput,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { Genre, Place } from "@prisma/client";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

type Props = {
  genres: Genre[];
  places: Place[];
};

export default function OptionsPopover({ genres, places }: Props) {
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);

  const {
    excludedGenres,
    excludedPlaces,
    grayOutPastGigs,
    maxPrice,
    resetPreferences,
    setExcludedGenres,
    setExcludedPlaces,
    setGrayOutPastGigs,
    setMaxPrice,
  } = usePreferences();

  const handleGenreSelect = (genreIds: string[]) => {
    setExcludedGenres(genres.filter((g) => genreIds.includes(g.id)));
  };

  return (
    <Popover
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      closeOnClickOutside={false}
      opened={areFiltersOpened}
      onChange={setAreFiltersOpened}
    >
      <Popover.Target>
        <Button onClick={() => setAreFiltersOpened(!areFiltersOpened)}>
          Options
        </Button>
      </Popover.Target>

      <Popover.Dropdown maw={350}>
        <Stack>
          <Box pos="absolute" top={0} right={0} m={4}>
            <CloseButton onClick={() => setAreFiltersOpened(false)} />
          </Box>
          <GenreSelect
            label="Genres exclus"
            genres={genres}
            value={excludedGenres.map((g) => g.id)}
            onChange={handleGenreSelect}
            clearable
          />

          <Stack gap="xs">
            <Text size="sm">Salles</Text>
            {places.map((place) => (
              <Checkbox
                key={place.id}
                checked={!excludedPlaces.includes(place.id)}
                label={place.name}
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

          <Checkbox
            checked={grayOutPastGigs}
            label="Griser les concerts passés"
            onChange={(event) => {
              const checked = event.currentTarget.checked;
              setGrayOutPastGigs(checked);
            }}
          />

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

          <Button onClick={resetPreferences}>Réinitialiser tout</Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
