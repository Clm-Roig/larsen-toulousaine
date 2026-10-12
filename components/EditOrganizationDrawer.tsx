import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { Button, Drawer, DrawerProps, Group } from "@mantine/core";
import { Organization } from "@prisma/client";
import { EditOrganizationArgs } from "@/domain/Organization/Organization.webService";
import OrganizationFields from "@/components/OrganizationFields";
import OptimizedImage from "@/components/OptimizedImage";
import { isValidUrl } from "@/utils/utils";

type Props = {
  editedOrganization: Organization | undefined;
  handleOnClose: () => void;
  handleOnSubmit: (formValues: EditOrganizationArgs) => void;
  isPending: boolean;
} & Omit<DrawerProps, "onClose">;

export function EditOrganizationDrawer({
  editedOrganization,
  handleOnClose,
  handleOnSubmit,
  isPending,
  ...drawerProps
}: Props) {
  const [imageFilePreview, setImageFilePreview] = useState<
    string | ArrayBuffer | null | undefined
  >(undefined);
  const form = useForm<EditOrganizationArgs>({
    initialValues: {
      authorId: "",
      id: "",
      isActive: false,
      logoFile: null,
      logoUrl: "",
      name: "",
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
    },
  });

  const handleImageFileChange = (value: File | null) => {
    if (!value) {
      form.setFieldValue("logoFile", null);
      setImageFilePreview(null);
      return;
    }
    form.setFieldValue("logoFile", value);
    form.validateField("logoFile");

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      setImageFilePreview(e.target?.result);
    });
    reader.readAsDataURL(value);
  };

  // set form values when selected organization changes
  useEffect(() => {
    if (editedOrganization && form.values.id !== editedOrganization.id) {
      form.setValues({
        ...editedOrganization,
      });
    }
  }, [editedOrganization, form]);

  return (
    <Drawer
      {...drawerProps}
      onClose={handleOnClose}
      position="right"
      title="Modifier l'association"
    >
      {!!form.values.id && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit(form.values);
          }}
        >
          <Group w="100%">
            <OrganizationFields
              w="100%"
              isActiveProps={{
                w: "100%",
                checked: !!form.getInputProps("isActive").value,
                ...form.getInputProps(`isActive`),
              }}
              logoFileProps={{
                w: "100%",
                ...form.getInputProps(`logoFile`),
              }}
              logoUrlProps={{
                w: "100%",
                ...form.getInputProps(`logoUrl`),
              }}
              nameProps={{
                w: "100%",
                ...form.getInputProps(`name`),
              }}
              onLogoFileChange={handleImageFileChange}
              onClearLogoUrl={() => {
                form.setFieldValue("logoUrl", "");
              }}
              withLabels
            />

            {(isValidUrl(form.values.logoUrl) ||
              (!!imageFilePreview && form.isValid("imageFile"))) && (
              <OptimizedImage
                mah={300}
                maw={600}
                src={imageFilePreview ?? form.values.logoUrl}
                alt="Logo de l'association"
                m={"auto"}
              />
            )}
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
