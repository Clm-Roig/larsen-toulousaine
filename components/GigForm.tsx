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
  Image,
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
import BandSelect from "./BandSelect";
import { isValidUrl } from "../utils/utils";

type Props = {
  genres: Genre[];
  places: Place[];
};

type AddGigValues = {
  date: Date | null;
  imageUrl?: string;
  place: Place["id"] | null;
  bands: Array<
    Omit<Band, "id" | "genres"> & {
      id?: BandWithGenres["id"] | undefined;
      key: string;
      genres: Array<Genre["id"]>;
    }
  >;
};

const getNewBand = () => ({ name: "", genres: [], key: randomId() });

export default function GigForm({ genres, places }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const form = useForm<AddGigValues>({
    initialValues: {
      imageUrl: "",
      date: null,
      place: null,
      bands: [],
    },
    validate: {
      date: (value) => (value ? null : "La date du concert est requise."),
      imageUrl: (value) =>
        !value || isValidUrl(value) ? null : "L'URL fournie n'est pas valide.",
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

  const handleOnSelectBand = (band: BandWithGenres) => {
    form.insertListItem(`bands`, {
      ...band,
      genres: band?.genres.map((g) => g.id),
      key: band?.id,
    });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { values } = form;
    const { date, bands, place } = values;
    const { user } = session || {};

    if (user && values && date && place) {
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
          date: date,
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
        form.reset();
        notifications.show({
          color: "green",
          message: "Concert ajouté avec succès !",
        });
      } catch (error) {
        notifications.show({
          color: "red",
          title: "Erreur à la création d'un concert",
          message: error.message,
        });
      } finally {
        setIsLoading(false);
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

      <BandSelect
        excludedBandIds={
          form.values.bands.filter((b) => !!b.id).map((b) => b.id) as string[]
        }
        onBandSelect={handleOnSelectBand}
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

      <Group justify="center" mt="sm">
        <Button
          variant="outline"
          onClick={() => form.insertListItem("bands", getNewBand())}
        >
          Ajouter un nouveau groupe
        </Button>
      </Group>

      <Divider my="md" />

      <TextInput
        label="URL de l'affiche du concert"
        description="URL de l'image de couverture de l'évènement Facebook (Clic droit sur l'image > Copier le lien de l'image) ou lien vers une image au ratio 16/9."
        {...form.getInputProps("imageUrl")}
      />

      {isValidUrl(form.values.imageUrl) && (
        <Image
          mah={200}
          maw={(200 * 16) / 9}
          src={form.values.imageUrl}
          alt="Affiche du concert"
          m={"auto"}
          mt={"sm"}
        />
      )}

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit">
          Ajouter le concert
        </Button>
      </Group>
    </form>
  );
}
