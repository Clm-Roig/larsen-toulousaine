import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, Drawer, DrawerProps, Group } from "@mantine/core";
import BandFields from "@/components/BandFields";
import { BandWithGenres } from "@/domain/Band/Band.type";
import { EditBandArgs } from "@/domain/Band/Band.webService";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";
import { useQuery } from "@tanstack/react-query";
import { Genre } from "@prisma/client";
import { getGenres } from "@/domain/Genre/Genre.webService";

type Props = {
  editedBand: BandWithGenres | undefined;
  handleOnClose: () => void;
  handleOnSubmit: (formValues: EditBandArgs) => void;
  isPending: boolean;
} & Omit<DrawerProps, "onClose">;

export function EditBandDrawer({
  editedBand,
  handleOnClose,
  handleOnSubmit,
  isPending,
  ...drawerProps
}: Props) {
  const { data: genres } = useQuery<Genre[], Error>({
    queryKey: ["genres"],
    queryFn: async () => await getGenres(),
  });

  const form = useForm<EditBandArgs>({
    initialValues: {
      id: "",
      city: null,
      countryCode: null,
      name: "",
      genres: [],
      isATribute: false,
      isLocal: false,
      isSafe: true,
      regionCode: null,
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
      genres: (value) => {
        return value?.length > 0 ? null : "Au moins un genre est requis.";
      },
    },
  });

  // When countryCode is deleted, delete regionCode
  form.watch("countryCode", ({ value }) => {
    if (!value && form.getValues().regionCode !== null) {
      form.setValues({
        ...form.values,
        countryCode: null,
        regionCode: null,
      });
    }
  });

  // When isLocal is true, set the region and country automatically
  form.watch("isLocal", ({ value, previousValue }) => {
    const { countryCode, regionCode } = form.getValues();
    if (
      previousValue === false &&
      countryCode !== LOCAL_COUNTRY_CODE &&
      regionCode !== LOCAL_REGION_CODE
    ) {
      form.setValues({
        ...form.values,
        isLocal: value,
        countryCode: LOCAL_COUNTRY_CODE,
        regionCode: LOCAL_REGION_CODE,
      });
    }
  });

  // set form values when selected band changes
  useEffect(() => {
    if (editedBand && form.values.id !== editedBand.id) {
      form.setValues({
        ...editedBand,
        genres: editedBand.genres.map((g) => g.id),
      });
    }
  }, [editedBand, form]);

  return (
    <Drawer
      {...drawerProps}
      onClose={handleOnClose}
      position="right"
      title="Modifier le groupe"
    >
      {!!form.values.id && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit(form.values);
          }}
        >
          <Group w="100%">
            <BandFields
              cityProps={{
                w: "100%",
                ...form.getInputProps(`city`),
              }}
              countryCodeProps={{
                w: "100%",
                ...form.getInputProps(`countryCode`),
              }}
              genreProps={{
                genres: genres || [],
                w: "100%",
                ...form.getInputProps(`genres`),
              }}
              isATributeProps={{
                w: "100%",
                checked: !!form.getInputProps("isATribute").value,
                ...form.getInputProps(`isATribute`),
              }}
              isLocalProps={{
                w: "100%",
                checked: !!form.getInputProps("isLocal").value,
                ...form.getInputProps(`isLocal`),
              }}
              isSafeProps={{
                w: "100%",
                checked: !!form.getInputProps("isSafe").value,
                ...form.getInputProps(`isSafe`),
              }}
              nameProps={{
                w: "100%",
                ...form.getInputProps(`name`),
              }}
              regionCodeProps={{
                w: "100%",
                disabled: !form.getInputProps("countryCode").value,
                ...form.getInputProps(`regionCode`),
              }}
              withLabels
            />
            <Group justify="space-between" w="100%">
              <Button variant="outline" onClick={handleOnClose}>
                Annuler
              </Button>
              <Button type="submit" loading={isPending}>
                Modifier
              </Button>
            </Group>
          </Group>
        </form>
      )}
    </Drawer>
  );
}
