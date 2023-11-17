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
  Box,
  TextInput,
  Paper,
  NumberInput,
  rem,
  Flex,
} from "@mantine/core";
import { Genre, Place } from "@prisma/client";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { FormEvent, useEffect } from "react";
import { BandWithGenres } from "../domain/Band/Band.type";
import BandSelect from "./BandSelect";
import { isValidUrl } from "../utils/utils";
import { GIG_IMG_RATIO_STRING, getGigImgWidth } from "../domain/image";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { useQuery } from "@tanstack/react-query";
import { getPlaces } from "@/domain/Place/Place.webService";
import { CreateGigArgs, EditGigArgs } from "@/domain/Gig/Gig.webService";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { DatePickerInput } from "@mantine/dates";
import OptimizedImage from "@/components/OptimizedImage";
import BandFields from "@/components/BandFields";

const INVALID_URL_ERROR_MSG = "L'URL fournie n'est pas valide.";

const getNewBand = () => ({
  name: "",
  genres: [],
  key: randomId(),
});

type Props = {
  gig?: GigWithBandsAndPlace;
  isLoading: boolean;
  onSubmit: (values: CreateGigArgs | EditGigArgs) => Promise<void>;
};

export default function GigForm({ gig, isLoading, onSubmit }: Props) {
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });

  const form = useForm<Omit<CreateGigArgs, "date"> & { date: Date | null }>({
    initialValues: {
      bands: [],
      date: null,
      description: null,
      imageUrl: null,
      placeId: "",
      ticketReservationLink: null,
      title: null,
      slug: "",
      price: null,
    },
    validate: {
      date: (value) => (value ? null : "La date du concert est requise."),
      imageUrl: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
      placeId: (value) => (value ? null : "Le lieu du concert est requis."),
      bands: {
        name: (value) => (value ? null : "Le nom est requis."),
        genres: (value) => {
          return value?.length > 0 ? null : "Au moins un genre est requis.";
        },
      },
      ticketReservationLink: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
    },
    validateInputOnBlur: true,
  });

  useEffect(() => {
    if (!form.values.id && gig?.id) {
      form.setValues({
        ...gig,
        bands: gig.bands
          .sort((b1, b2) => b1.order - b2.order)
          .map((band) => ({
            ...band,
            genres: band.genres.map((g) => g.id),
            key: band.id,
          })),
        date: new Date(gig.date),
        slug: "", // slug will be recomputed when saving the gig
      });
    }
  }, [form, gig]);

  const handleOnSelectBand = (band: BandWithGenres) => {
    form.insertListItem(`bands`, {
      ...band,
      genres: band?.genres.map((g) => g.id),
      key: band?.id,
    });
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...form.values,
      bands: form.values.bands.map((b, i) => ({ ...b, order: i + 1 })),
      date: form.values.date as Date, // date can't be null if the form is submitted
      price:
        form.values.price || form.values.price === 0
          ? Number(form.values.price)
          : null,
    });
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Flex gap="sm" direction={{ base: "column", xs: "row" }}>
        <DatePickerInput
          label="Date"
          valueFormat="DD MMMM YYYY"
          required
          style={{ flex: 1 }}
          {...form.getInputProps("date")}
        />

        <Select
          label="Lieu"
          placeholder="Sélectionner un lieu"
          required
          searchable
          data={places?.map((place) => ({
            value: place.id,
            label: place.name,
          }))}
          style={{ flex: 1 }}
          {...form.getInputProps("placeId")}
        />
      </Flex>

      <Divider my="md" />

      <Text>Groupes</Text>

      <BandSelect
        excludedBandIds={
          form.values.bands.filter((b) => !!b.id).map((b) => b.id) as string[]
        }
        onBandSelect={handleOnSelectBand}
      />

      <DragDropContext
        onDragEnd={({ destination, source }) =>
          form.reorderListItem("bands", {
            from: source.index,
            to: destination?.index || 0,
          })
        }
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {form.values.bands.map((band, index) => (
                <Draggable
                  key={band.id || band.key}
                  index={index}
                  draggableId={band.id || band.key}
                >
                  {(provided) => (
                    <Paper
                      p="xs"
                      mt="xs"
                      withBorder
                      shadow="none"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <Group style={{ alignItems: "flex-start" }}>
                        <IconGripVertical
                          size={rem(16)}
                          style={{ alignSelf: "center" }}
                        />
                        <BandFields
                          nameProps={{
                            disabled: !!form.values.bands[index].id,
                            ...form.getInputProps(`bands.${index}.name`),
                          }}
                          genreProps={{
                            genres: genres || [],
                            style: { flex: 1 },
                            disabled: !!form.values.bands[index].id,
                            ...form.getInputProps(`bands.${index}.genres`),
                          }}
                        />

                        <Box>
                          <ActionIcon
                            color="red"
                            onClick={() => form.removeListItem("bands", index)}
                            size="lg"
                          >
                            <IconTrash size="1rem" />
                          </ActionIcon>
                        </Box>
                      </Group>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
        description={`URL de l'image de couverture de l'évènement Facebook 
        (Clic droit sur l'image > Copier le lien de l'image) ou lien vers une image au ratio ${GIG_IMG_RATIO_STRING}.`}
        {...form.getInputProps("imageUrl")}
      />

      {isValidUrl(form.values.imageUrl) && (
        <OptimizedImage
          mah={200}
          maw={getGigImgWidth(200)}
          src={form.values.imageUrl}
          alt="Affiche du concert"
          m={"auto"}
          mt={"sm"}
        />
      )}

      <TextInput
        label="Lien de réservation des tickets"
        {...form.getInputProps("ticketReservationLink")}
      />

      <NumberInput
        allowNegative={false}
        suffix="€"
        decimalScale={2}
        label="Prix"
        description={`Prix minimum constaté. Pour un concert gratuit ou à prix libre, renseigner "0€".`}
        decimalSeparator=","
        {...form.getInputProps("price")}
      />

      <Group justify="flex-end" mt="md">
        <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
          {form.values.id ? "Éditer le concert" : "Ajouter le concert"}
        </Button>
      </Group>
    </form>
  );
}
