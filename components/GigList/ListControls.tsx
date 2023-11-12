import {
  Box,
  Checkbox,
  CloseButton,
  Text,
  ActionIcon,
  Group,
  Popover,
  Button,
  Flex,
  Stack,
  Space,
} from "@mantine/core";
import dayjs from "dayjs";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { capitalize } from "../../utils/utils";
import GenreSelect from "../GenreSelect";
import { Genre, Place } from "@prisma/client";
import { useState } from "react";
import usePreferences from "../../hooks/usePreferences";
require("dayjs/locale/fr");

type Props = {
  genres: Genre[];
  places: Place[];
  selectedMonth: Date;
  setSelectedMonth: (monthDate: Date) => void;
};

export default function ListControls({
  genres,
  places,
  selectedMonth,
  setSelectedMonth,
}: Props) {
  const {
    excludedGenres,
    excludedPlaces,
    setExcludedGenres,
    setExcludedPlaces,
  } = usePreferences();
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);
  const incrementMonth = () => {
    setSelectedMonth(dayjs(selectedMonth).add(1, "month").toDate());
  };
  const decrementMonth = () => {
    setSelectedMonth(dayjs(selectedMonth).subtract(1, "month").toDate());
  };

  const handleGenreSelect = (genreIds: string[]) => {
    setExcludedGenres(genres.filter((g) => genreIds.includes(g.id)));
  };

  return (
    <Flex justify="space-between" direction="row" w="100%">
      {/* Hidden button (same as the right on) for flex layout (left / center / right) */}
      <Button visibleFrom="xs" style={{ visibility: "hidden" }}>
        Filtres
      </Button>

      <Group>
        <ActionIcon
          onClick={decrementMonth}
          aria-label="Décrémenter mois"
          size="lg"
        >
          <IconChevronLeft />
        </ActionIcon>
        <Text fw="bold" w={130} ta="center">
          {capitalize(dayjs(selectedMonth).locale("fr").format("MMMM YYYY"))}
        </Text>
        <ActionIcon
          onClick={incrementMonth}
          aria-label="Incrémenter mois"
          size="lg"
        >
          <IconChevronRight />
        </ActionIcon>
      </Group>

      <Box>
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
              Filtres
            </Button>
          </Popover.Target>

          <Popover.Dropdown maw={350}>
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

            <Space h="sm" />
            <Text size="sm">Salles</Text>
            <Space h="xs" />

            <Stack gap="xs">
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
          </Popover.Dropdown>
        </Popover>
      </Box>
    </Flex>
  );
}
