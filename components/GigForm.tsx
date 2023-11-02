"use client";

import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import {
  Button,
  Group,
  Select,
  Divider,
  ActionIcon,
  Text,
  Stack,
  Box,
  TextInput,
} from "@mantine/core";
import DatePickerInput from "./DatePickerInput";
import { Band, Genre, Place } from "@prisma/client";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { BandWithGenres } from "../domain/Band/Band.type";
import GenreSelect from "./GenreSelect";
import { MAX_GENRES_PER_BAND } from "../domain/constants";
import { createGig } from "../domain/Gig/Gig.webService";
import { searchBandsByName } from "../domain/Band/Band.webService";

type Props = {
  genres: Genre[];
  places: Place[];
};

type AddGigValues = {
  date: Date;
  place?: Place["id"];
  bands: Array<
    Omit<Band, "id" | "genres"> & {
      id?: BandWithGenres["id"] | undefined;
      key: string;
      genres: Array<Genre["id"]>;
    }
  >;
};

type BandSuggestion = {
  label: string;
  value: BandWithGenres;
};

const NB_CHAR_TO_LAUNCH_BAND_SEARCH = 2;

const getNewBand = () => ({ name: "", genres: [], key: randomId() });

export default function GigForm({ genres, places }: Props) {
  const { data: session } = useSession();
  const [suggestions, setSuggestions] = useState<BandSuggestion[]>([]);
  const [searchedBandInput, setSearchedBandInput] = useState("");
  const [isLoadingBandSuggestions, setIsLoadingBandSuggestions] =
    useState(false);

  const form = useForm<AddGigValues>({
    initialValues: {
      date: new Date(),
      place: undefined,
      bands: [],
    },
    validate: {
      date: (value) => (value ? null : "La date du concert est requise."),
      place: (value) => (value ? null : "Le lieu du concert est requis."),
      bands: {
        name: (value) => (value ? null : "Le nom est requis."),
        genres: (value) => {
          return value?.length > 0 ? null : "Au moins un genre est requis.";
        },
      },
    },
    validateInputOnBlur: true,
  });

  const handleOnSearchBandChange = async (value: string) => {
    setSearchedBandInput(value);
    let newSuggestions: BandSuggestion[] = [];
    if (value && value.length >= 2) {
      setSuggestions([]);
      setIsLoadingBandSuggestions(true);
      newSuggestions = (await searchBandsByName(value))
        .filter((band) =>
          form.values.bands.every(
            (selectedBand) => selectedBand.id !== band.id,
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
      form.insertListItem(`bands`, {
        ...foundBand,
        genres: foundBand?.genres.map((g) => g.id),
        key: foundBand?.id,
      });
      setSuggestions([]);
    }
    setSearchedBandInput("");
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { values } = form;
    const { user } = session || {};

    if (user && values) {
      const { bands, place } = values;

      const toConnectBands = bands
        .filter((b) => !!b.id)
        .map((b) => ({ id: b.id }));
      const toCreateBands = bands
        .filter((b) => !b.id)
        .map((b) => ({
          name: b.name,
          genres: {
            connect: b.genres.map((g) => ({ id: g })),
          },
        }));
      try {
        await createGig({
          ...values,
          author: {
            connect: {
              id: user.id,
            },
          },
          bands: {
            ...(toConnectBands?.length > 0 ? { connect: toConnectBands } : {}),
            ...(toCreateBands?.length > 0 ? { create: toCreateBands } : {}),
          },
          place: {
            connect: {
              id: place,
            },
          },
          title: null,
          description: null,
        });
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un concert",
          message: error.message,
        });
      }
    }
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Stack>
        <DatePickerInput
          label="Date du concert"
          valueFormat="DD MMMM YYYY"
          required
          {...form.getInputProps("date")}
        />

        <Select
          label="Lieu"
          placeholder="Sélectionner un lieu"
          required
          searchable
          data={places.map((place) => ({
            value: place.id,
            label: place.name,
          }))}
          {...form.getInputProps("place")}
        />
      </Stack>

      <Divider my="md" />

      <Text>Groupes</Text>

      <Select
        label={"Chercher un groupe existant"}
        searchable
        required
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
      />

      {form.values.bands.map((band, index) => (
        <Group
          h={index === 0 ? 80 : 60}
          key={band.id || band.key}
          mt="xs"
          style={{ alignItems: "flex-start" }}
        >
          <TextInput
            label={index === 0 ? "Nom du groupe" : ""}
            required
            disabled={!!form.values.bands[index].id}
            {...form.getInputProps(`bands.${index}.name`)}
          />

          <GenreSelect
            label={index === 0 ? "Genre(s) (3 max)" : ""}
            withAsterisk
            maxValues={MAX_GENRES_PER_BAND}
            genres={genres}
            style={{ flex: 1 }}
            disabled={!!form.values.bands[index].id}
            {...form.getInputProps(`bands.${index}.genres`)}
          />

          <Box
            style={{
              alignSelf: index === 0 ? "center" : undefined,
            }}
          >
            <ActionIcon
              color="red"
              onClick={() => form.removeListItem("bands", index)}
              size="lg"
            >
              <IconTrash size="1rem" />
            </ActionIcon>
          </Box>
        </Group>
      ))}

      <Group justify="center" mt="md">
        <Button
          variant="outline"
          onClick={() => form.insertListItem("bands", getNewBand())}
        >
          Ajouter un nouveau groupe
        </Button>
      </Group>

      <Group justify="flex-end" mt="md">
        <Button type="submit">Ajouter le concert</Button>
      </Group>
    </form>
  );
}
