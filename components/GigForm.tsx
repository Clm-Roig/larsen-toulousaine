"use client";

import { useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import dayjs from "dayjs";
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
  Flex,
  Alert,
  Stack,
  Loader,
  Center,
  LoadingOverlay,
  SegmentedControl,
  VisuallyHidden,
  InputLabel,
  InputDescription,
  Radio,
} from "@mantine/core";
import { Genre, Place } from "@prisma/client";
import {
  IconCheck,
  IconGripVertical,
  IconInfoCircle,
  IconQuestionMark,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { BandWithGenres } from "../domain/Band/Band.type";
import BandSelect from "./BandSelect";
import { isValidUrl } from "../utils/utils";
import { GIG_IMG_RATIO_STRING, getGigImgWidth } from "../domain/image";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { useQuery } from "@tanstack/react-query";
import { getPlaces } from "@/domain/Place/Place.webService";
import {
  CreateGigArgs,
  EditGigArgs,
  getGigByDateAndPlaceId,
} from "@/domain/Gig/Gig.webService";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  GigType,
  GigWithBandsAndPlace,
  gigTypeToString,
} from "@/domain/Gig/Gig.type";
import { DatePickerInput } from "@mantine/dates";
import OptimizedImage from "@/components/OptimizedImage";
import BandFields from "@/components/BandFields";
import {
  getGigTitle,
  hasTicketLinkBoolToFormValue,
  hasTicketLinkFormValueToBool,
} from "@/domain/Gig/Gig.service";
import { MAIN_CITY } from "@/domain/Place/constants";

const { FESTIVAL, GIG } = GigType;

const INVALID_URL_ERROR_MSG = "L'URL fournie n'est pas valide.";

type Props = {
  gig?: GigWithBandsAndPlace;
  isLoading: boolean;
  onSubmit: (values: CreateGigArgs | EditGigArgs) => void;
};

export default function GigForm({ gig, isLoading, onSubmit }: Props) {
  const [gigType, setGigType] = useState<GigType>(gig?.name ? FESTIVAL : GIG);
  const gigTypeString = useMemo(() => gigTypeToString(gigType), [gigType]);
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<Place[], Error>({
    queryKey: ["places"],
    queryFn: async () => await getPlaces(),
  });

  const form = useForm<
    // endDate is managed using dateRange array
    Omit<CreateGigArgs, "date" | "endDate"> & {
      date: Date | null;
      dateRange: [Date | null, Date | null];
    }
  >({
    validateInputOnBlur: true,
    initialValues: {
      bands: [],
      date: null,
      dateRange: [null, null],
      description: null,
      facebookEventUrl: null,
      hasTicketReservationLink: null,
      imageUrl: null,
      name: null,
      placeId: "",
      price: null,
      slug: "",
      ticketReservationLink: null,
      title: null,
    },
    validate: {
      date: (value) =>
        !value && gigType === GIG ? "La date du concert est requise." : null,
      imageUrl: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
      facebookEventUrl: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
      placeId: (value) => (value ? null : "Le lieu du concert est requis."),
      bands: {
        name: (value) => (value ? null : "Le nom est requis."),
      },
      name: (value) =>
        !value && gigType === FESTIVAL
          ? "Le nom est requis pour un festival."
          : null,
      ticketReservationLink: (value, values) =>
        !value && values.hasTicketReservationLink === true
          ? "Le lien de réservation est requis."
          : !value || isValidUrl(value)
            ? null
            : INVALID_URL_ERROR_MSG,
    },
  });

  const {
    data: samePlaceSameDayGig,
    isFetching: isLoadingSamePlaceSameDayGig,
  } = useQuery<GigWithBandsAndPlace | null, Error>({
    queryKey: [
      "samePlaceSameDayGig",
      form.values.date,
      form.values.placeId,
      form.values.dateRange,
    ],
    queryFn: async () => {
      const { date, dateRange, placeId, id } = form.values;
      const startDate = dateRange[0] || date;
      if (startDate && placeId) {
        const res = await getGigByDateAndPlaceId(startDate, placeId);
        if (res?.id === id) {
          return null;
        }
        return res;
      }
      return null;
    },
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
        dateRange: gig.endDate
          ? [new Date(gig.date), new Date(gig.endDate)]
          : [new Date(gig.date), new Date(gig.date)],
        slug: "", // slug will be recomputed when saving the gig
        hasTicketReservationLink: gig.hasTicketReservationLink,
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

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { dateRange, ...cleanedFormValues } = form.values;
    const { bands, date, price } = cleanedFormValues;
    const isRangeSameDay = dayjs(dateRange[0]).isSame(dayjs(dateRange[1]));
    onSubmit({
      ...cleanedFormValues,
      bands: bands.map((b, i) => ({ ...b, order: i + 1 })),
      date: dateRange[0] && !isRangeSameDay ? dateRange[0] : (date as Date),
      endDate: dateRange[1],
      price: price || price === 0 ? Number(price) : null,
    });
  };

  const insertNewBand = (bandName?: string) => {
    const newBand = {
      name: bandName || "",
      genres: [],
      key: randomId(),
    };
    form.insertListItem("bands", newBand);
  };

  const handleGigTypeChange = (value: string) => {
    form.setFieldValue("dateRange", [null, null]);
    form.setFieldValue("date", null);
    setGigType(value as GigType);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Box pos="relative" p="xs">
        <LoadingOverlay visible={isLoading} />
        <Stack>
          <Flex gap="sm" direction={{ base: "column", xs: "row" }}>
            <Radio.Group
              value={gigType}
              onChange={handleGigTypeChange}
              name="gigType"
              label="Type d'évènement"
              flex={1}
              withAsterisk
            >
              <Group mt="md">
                <Radio value={GIG} label={gigTypeToString(GIG)} />
                <Radio value={FESTIVAL} label={gigTypeToString(FESTIVAL)} />
              </Group>
            </Radio.Group>

            {gigType === FESTIVAL && (
              <TextInput
                flex={2}
                label="Nom du festival"
                required
                {...form.getInputProps("name")}
              />
            )}
          </Flex>

          <Flex gap="sm" direction={{ base: "column", xs: "row" }}>
            <DatePickerInput
              label="Date"
              valueFormat="DD MMMM YYYY"
              required
              style={{ flex: 1 }}
              type={gigType === FESTIVAL ? "range" : "default"}
              allowSingleDateInRange
              {...form.getInputProps(
                gigType === FESTIVAL ? "dateRange" : "date",
              )}
            />

            <Select
              label="Lieu"
              placeholder="Sélectionner un lieu"
              required
              searchable
              data={places
                ?.sort((p1) => (p1.isClosed ? 1 : -1))
                .map((place) => ({
                  value: place.id,
                  label: `${place.name} ${
                    place.city !== MAIN_CITY ? `(${place.city})` : ""
                  } ${place.isClosed ? " (fermé)" : ""}`,
                  disabled: place.isClosed,
                }))}
              style={{ flex: 1 }}
              {...form.getInputProps("placeId")}
            />
          </Flex>
          {isLoadingSamePlaceSameDayGig &&
            (form.values.date || form.values.dateRange[0]) &&
            form.values.placeId && (
              <Center>
                <Group>
                  <Loader type="dots" />
                  <Text fs="italic">{`Vérification de la présence d'un ${gigTypeString}...`}</Text>
                </Group>
              </Center>
            )}
          {!isLoadingSamePlaceSameDayGig && !!samePlaceSameDayGig && (
            <>
              <Alert
                color="yellow"
                title="Un concert a déjà lieu au jour et lieu sélectionnés :"
                icon={<IconInfoCircle />}
                p="xs"
              >
                <b>{getGigTitle(samePlaceSameDayGig)}</b>
                <br />
                <i>
                  Vous pouvez tout de même continuer à ajouter un nouveau
                  concert : il est possible que deux concerts aient lieu le même
                  jour au même endroit.
                </i>
              </Alert>
            </>
          )}
        </Stack>

        <Divider my="md" />

        <Text>Groupes</Text>

        <BandSelect
          excludedBands={form.values.bands}
          onBandSelect={handleOnSelectBand}
          onNoSuggestions={insertNewBand}
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
                            size={16}
                            style={{ alignSelf: "center" }}
                          />
                          <Box>
                            <ActionIcon
                              color="red"
                              onClick={() =>
                                form.removeListItem("bands", index)
                              }
                              size="lg"
                            >
                              <IconTrash size="1rem" />
                            </ActionIcon>
                          </Box>
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
                            isLocalProps={{
                              disabled: !!form.values.bands[index].id,
                              checked: !!form.getInputProps(
                                `bands.${index}.isLocal`,
                              ).value,
                              ...form.getInputProps(`bands.${index}.isLocal`),
                            }}
                            withShortIsLocalDescription
                          />
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

        <Divider my="md" />

        <Stack>
          <TextInput
            label="URL de l'évènement Facebook"
            {...form.getInputProps("facebookEventUrl")}
          />

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
            />
          )}

          <Box>
            <InputLabel display="block">
              Le concert a-t-il une billetterie ?
            </InputLabel>
            <InputDescription mb={5}>
              <>Oui = il y a une billetterie et le lien est connu</>
              <br />
              Inconnu = on ne sait pas s&apos;il y aura une billetterie ou pas
              <br /> Non = il n&apos;y a pas de billetterie
            </InputDescription>
            <SegmentedControl
              size="xs"
              data={[
                {
                  value: "true",
                  label: (
                    <>
                      <IconCheck color="green" />
                      <VisuallyHidden>Oui</VisuallyHidden>
                    </>
                  ),
                },
                {
                  value: "",
                  label: (
                    <>
                      <IconQuestionMark />
                      <VisuallyHidden>Inconnu</VisuallyHidden>
                    </>
                  ),
                },
                {
                  value: "false",
                  label: (
                    <>
                      <IconX color="red" />
                      <VisuallyHidden>Non</VisuallyHidden>
                    </>
                  ),
                },
              ]}
              {...form.getInputProps("hasTicketReservationLink")}
              value={hasTicketLinkBoolToFormValue(
                form.getInputProps("hasTicketReservationLink").value,
              )}
              onChange={(value: string) =>
                form.setFieldValue(
                  "hasTicketReservationLink",
                  hasTicketLinkFormValueToBool(value),
                )
              }
            />
          </Box>

          {!!form.values.hasTicketReservationLink && (
            <TextInput
              label="Lien de réservation des tickets"
              {...form.getInputProps("ticketReservationLink")}
            />
          )}

          <NumberInput
            allowNegative={false}
            suffix="€"
            decimalScale={2}
            label="Prix"
            description={`Prix minimum constaté. Pour un concert gratuit ou à prix libre, renseigner "0€".`}
            decimalSeparator=","
            {...form.getInputProps("price")}
          />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button loading={isLoading} type="submit" disabled={!form.isValid()}>
            {`${form.values.id ? "Éditer" : "Ajouter"} le ${gigTypeString}`}
          </Button>
        </Group>
      </Box>
    </form>
  );
}
