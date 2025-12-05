"use client";

import { formRootRule, isNotEmpty, useForm } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import dayjs from "@/lib/dayjs";
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
  FileInput,
  CloseButton,
  Textarea,
} from "@mantine/core";
import { Genre } from "@prisma/client";
import {
  IconCheck,
  IconFile,
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
import {
  GIG_IMG_RATIO_STRING,
  MAX_IMAGE_SIZE,
  getGigImgWidth,
} from "../domain/image";
import { getGenres } from "@/domain/Genre/Genre.webService";
import { useQuery } from "@tanstack/react-query";
import { getPlaces } from "@/domain/Place/Place.webService";
import {
  CreateGigArgs,
  EditGigArgs,
  getGigByDateAndPlaceId,
  CreateGigArgs,
} from "@/domain/Gig/Gig.webService";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  GigMinimal,
  GigType,
  GigWithBandsAndPlace,
  gigTypeToString,
} from "@/domain/Gig/Gig.type";
import { DatePickerInput } from "@mantine/dates";
import OptimizedImage from "@/components/OptimizedImage";
import BandFields from "@/components/BandFields";
import { getGigTitle } from "@/domain/Gig/Gig.service";
import {
  boolean3ChoicesToFormValue,
  boolean3ChoicesFormValueToBool,
} from "@/utils/utils";
import { MAIN_CITY } from "@/domain/Place/constants";
import { PlaceWithGigCount } from "@/domain/Place/Place.type";

const { FESTIVAL, GIG } = GigType;

const INVALID_URL_ERROR_MSG = "L'URL fournie n'est pas valide.";

type Props = {
  gig?: GigWithBandsAndPlace;
  isLoading: boolean;
  onSubmit: (values: CreateGigArgs | EditGigArgs) => void;
};

export default function GigForm({ gig, isLoading, onSubmit }: Props) {
  const [imageFilePreview, setImageFilePreview] = useState<
    string | ArrayBuffer | null | undefined
  >(undefined);
  const [gigType, setGigType] = useState<GigType>(gig?.name ? FESTIVAL : GIG);
  const gigTypeString = useMemo(() => gigTypeToString(gigType), [gigType]);
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });
  const { data: places } = useQuery<PlaceWithGigCount[], Error>({
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
      isAcceptingBankCard: null,
      imageFile: null,
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
      imageFile: (value) => {
        if (!value) return null;
        const { size, type } = value;
        if (!type.startsWith("image/")) {
          ("Le fichier doit être une image.");
        }
        if (size > MAX_IMAGE_SIZE) {
          return `Le fichier est trop volumineux (taille maximale autorisée : ${MAX_IMAGE_SIZE / 1000000} Mo).`;
        }
        return null;
      },
      imageUrl: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
      facebookEventUrl: (value) =>
        !value || isValidUrl(value) ? null : INVALID_URL_ERROR_MSG,
      placeId: isNotEmpty("Le lieu du concert est requis."),
      bands: {
        [formRootRule]: (value) =>
          gigType === GIG && value?.length === 0
            ? "Un groupe est requis."
            : null,
        name: isNotEmpty("Le nom est requis"),
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
  } = useQuery<GigMinimal | null, Error>({
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
    // Initial loading of an existing gig
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
        date: gigType === FESTIVAL ? null : new Date(gig.date),
        dateRange:
          gigType === FESTIVAL
            ? [new Date(gig.date), gig.endDate ? new Date(gig.endDate) : null]
            : [null, null],
        slug: "", // slug will be recomputed when saving the gig
      });
      if (gig.name) {
        setGigType(FESTIVAL);
      }
    }
  }, [form, gig, gigType]);

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
    const { bands, name, price } = cleanedFormValues;
    const isAFestival = !!name;

    /* Date management, 3 cases :
        - Festival + end on same day => date is starting date and endDate is null
        - Festival + end on another day => date is starting date and endDate is ending date
        - Gig => date is date and endDate is null
    */
    const isRangeSameDay = dayjs(dateRange[0]).isSame(dayjs(dateRange[1]));
    const date =
      isAFestival && !!dateRange[0]
        ? dateRange[0]
        : (cleanedFormValues.date as Date);
    const endDate = isAFestival && isRangeSameDay ? null : dateRange[1];

    onSubmit({
      ...cleanedFormValues,
      bands: bands.map((b, i) => ({ ...b, order: i + 1 })),
      date: date,
      endDate: endDate,
      price: price || price === 0 ? Number(price) : null,
    });
  };

  const insertNewBand = (bandName?: string) => {
    const newBand = {
      name: bandName || "",
      genres: [],
      isSafe: true,
      key: randomId(),
    };
    form.insertListItem("bands", newBand);
  };

  const handleGigTypeChange = (value: string) => {
    form.setFieldValue("date", null);
    form.setFieldValue("dateRange", [null, null]);
    form.setFieldValue("name", null);
    setGigType(value as GigType);
  };

  const handleImageFileChange = (value: File | null) => {
    if (!value) {
      form.setFieldValue("imageFile", null);
      setImageFilePreview(null);
      return;
    }
    form.setFieldValue("imageFile", value);
    form.validateField("imageFile");

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      setImageFilePreview(e.target?.result);
    });
    reader.readAsDataURL(value);
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
              onChange={(value) => {
                if (gigType === FESTIVAL && Array.isArray(value)) {
                  const date1 = value[0] ? new Date(value[0]) : null;
                  const date2 = value[1] ? new Date(value[1]) : null;
                  // Forced to type the function because getInputProps returns any
                  const onChange = form.getInputProps("dateRange").onChange as (
                    dates: Array<Date | null>,
                  ) => void;
                  // use dayjs to include timezone because Mantine Date has no timezone
                  onChange([
                    date1 ? dayjs(date1).toDate() : null,
                    date2 ? dayjs(date2).toDate() : null,
                  ]);
                } else {
                  const valueAsString = value as string;
                  // Forced to type the function because getInputProps returns any
                  const onChange = form.getInputProps("date").onChange as (
                    date: Date | null,
                  ) => void;
                  // use dayjs to include timezone because Mantine Date has no timezone
                  onChange(value ? dayjs(valueAsString).toDate() : null);
                }
              }}
            />

            <Select
              label="Lieu"
              placeholder="Sélectionner un lieu"
              clearable
              data={places
                ?.sort((p1, p2) => {
                  if (p1.isClosed) return 1;
                  if (p2.isClosed) return -1;
                  return p2._count.gigs - p1._count.gigs;
                })
                .map((place) => ({
                  value: place.id,
                  label: `${place.name} ${
                    place.city !== MAIN_CITY ? `(${place.city})` : ""
                  } ${place.isClosed ? " (fermé)" : ""}`,
                  disabled: place.isClosed,
                }))}
              required
              searchable
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

        <InputLabel required={gigType === GIG}>Groupes</InputLabel>
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
                            isATributeProps={{
                              disabled: !!form.values.bands[index].id,
                              checked: !!form.getInputProps(
                                `bands.${index}.isATribute`,
                              ).value,
                              ...form.getInputProps(
                                `bands.${index}.isATribute`,
                              ),
                            }}
                            isLocalProps={{
                              disabled: !!form.values.bands[index].id,
                              checked: !!form.getInputProps(
                                `bands.${index}.isLocal`,
                              ).value,
                              ...form.getInputProps(`bands.${index}.isLocal`),
                            }}
                            isSafeProps={{
                              disabled: !!form.values.bands[index].id,
                              checked: !!form.getInputProps(
                                `bands.${index}.isSafe`,
                              ).value,
                              ...form.getInputProps(`bands.${index}.isSafe`),
                            }}
                            withShortBoolDescriptions
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
          <Text>Affiche du concert</Text>
          <Text c="dimmed" size="sm">
            {`Privilégier l'image de couverture de l'évènement Facebook 
        (Clic droit sur l'image > Copier le lien de l'image) ou lien vers une image au ratio 
        `}
            <b>{`${GIG_IMG_RATIO_STRING}`}</b>.
          </Text>

          <FileInput
            accept="image/*"
            label="Image de l'affiche du concert"
            leftSection={<IconFile />}
            rightSection={
              !!form.getValues().imageFile && (
                <CloseButton onClick={() => handleImageFileChange(null)} />
              )
            }
            placeholder="Uploader un fichier"
            {...form.getInputProps("imageFile")}
            onChange={handleImageFileChange}
            disabled={!!form.getValues().imageUrl}
          />
          <Text ta="center">Ou</Text>
          <TextInput
            label="URL de l'affiche du concert"
            rightSection={
              <ActionIcon
                // Mimic Select clearable icon
                variant="transparent"
                color="gray"
                aria-label="Clear input"
                size="xs"
                onClick={() => {
                  form.setFieldValue("imageUrl", "");
                }}
              >
                <IconX />
              </ActionIcon>
            }
            {...form.getInputProps("imageUrl")}
            disabled={!!form.getValues().imageFile?.name}
          />

          {(isValidUrl(form.values.imageUrl) ||
            (!!imageFilePreview && form.isValid("imageFile"))) && (
            <OptimizedImage
              mah={200}
              maw={getGigImgWidth(200)}
              src={form.values.imageUrl || imageFilePreview}
              alt="Affiche du concert"
              m={"auto"}
            />
          )}

          <Divider my="md" />

          <TextInput
            label="URL de l'évènement Facebook"
            {...form.getInputProps("facebookEventUrl")}
          />

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
              value={boolean3ChoicesToFormValue(
                form.getInputProps("hasTicketReservationLink").value,
              )}
              onChange={(value: string) =>
                form.setFieldValue(
                  "hasTicketReservationLink",
                  boolean3ChoicesFormValueToBool(value),
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
            description={`Prix minimum constaté. Pour un concert offert ou à prix libre, renseigner "0€".`}
            decimalSeparator=","
            {...form.getInputProps("price")}
          />

          <Box>
            <InputLabel display="block">
              La carte bleue est-elle acceptée ?
            </InputLabel>
            <InputDescription mb={5}>
              Pour payer l&apos;entrée uniquement (pas pour le bar ou le merch
              des groupes par exemple).
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
              {...form.getInputProps("isAcceptingBankCard")}
              value={boolean3ChoicesToFormValue(
                form.getInputProps("isAcceptingBankCard").value,
              )}
              onChange={(value: string) =>
                form.setFieldValue(
                  "isAcceptingBankCard",
                  boolean3ChoicesFormValueToBool(value),
                )
              }
            />
          </Box>

          <Textarea
            placeholder="Informations spécifiques à l'évènement (nourriture, boissons, expositions, artisans...)"
            label="Description"
            autosize
            minRows={2}
            {...form.getInputProps("description")}
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
