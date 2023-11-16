import {
  Box,
  Checkbox,
  CloseButton,
  Text,
  ActionIcon,
  Popover,
  Button,
  Flex,
  Stack,
  NumberInput,
  SegmentedControl,
  Divider,
  SimpleGrid,
} from "@mantine/core";
import dayjs from "dayjs";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { capitalize } from "../../utils/utils";
import GenreSelect from "../GenreSelect";
import { Genre, Place } from "@prisma/client";
import { useState } from "react";
import usePreferences from "../../hooks/usePreferences";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ViewType } from "@/domain/ViewType";

type Props = {
  genres: Genre[];
  places: Place[];
  selectedMonth: Date;
  setSelectedMonth: (monthDate: Date) => void;
};

const optionsLabel = "Options";

export default function ListControls({
  genres,
  places,
  selectedMonth,
  setSelectedMonth,
}: Props) {
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
    setViewType,
    viewType,
  } = usePreferences();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);

  const incrementMonth = () => {
    const nextMonth = dayjs(selectedMonth).add(1, "month").toDate();
    setSelectedMonth(nextMonth);
    // Update url search params
    const urlSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    urlSearchParams.set("année", nextMonth.getFullYear() + "");
    urlSearchParams.set("mois", nextMonth.getMonth() + 1 + ""); // getMonth() goes from 0 to 11
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const decrementMonth = () => {
    const previousMonth = dayjs(selectedMonth).subtract(1, "month").toDate();
    setSelectedMonth(previousMonth);
    // Update url search params
    const urlSearchParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    urlSearchParams.set("année", previousMonth.getFullYear() + "");
    urlSearchParams.set("mois", previousMonth.getMonth() + 1 + ""); // getMonth() goes from 0 to 11
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const handleGenreSelect = (genreIds: string[]) => {
    setExcludedGenres(genres.filter((g) => genreIds.includes(g.id)));
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {/* Hidden block to preserve grid layout */}
      <Box style={{ visibility: "hidden" }}></Box>

      <Flex gap="xs" justify="center" align="center">
        <ActionIcon
          onClick={decrementMonth}
          aria-label="Décrémenter mois"
          size="lg"
        >
          <IconChevronLeft />
        </ActionIcon>
        <Text fw="bold" w={125} ta="center">
          {capitalize(dayjs(selectedMonth).format("MMMM YYYY"))}
        </Text>
        <ActionIcon
          onClick={incrementMonth}
          aria-label="Incrémenter mois"
          size="lg"
        >
          <IconChevronRight />
        </ActionIcon>
      </Flex>

      <Flex
        gap="xs"
        justify={{ base: "center", sm: "flex-end" }}
        align="center"
      >
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
              {optionsLabel}
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
        <Divider orientation="vertical" size="xs" />
        <SegmentedControl
          data={[
            { label: "Grille", value: ViewType.GRID },
            { label: "Liste", value: ViewType.LIST },
          ]}
          onChange={(data) => (data ? setViewType(data as ViewType) : null)}
          value={viewType}
          pl={0}
        />
      </Flex>
    </SimpleGrid>
  );
}
