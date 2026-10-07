import { useEffect } from "react";
import { useForm } from "@mantine/form";
import { Button, Drawer, DrawerProps, Group } from "@mantine/core";
import { Organization } from "@prisma/client";
import { EditOrganizationArgs } from "@/domain/Organization/Organization.webService";
import OrganizationFields from "@/components/OrganizationFields";

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
  const form = useForm<EditOrganizationArgs>({
    initialValues: {
      authorId: "",
      id: "",
      isActive: false,
      logoUrl: "",
      name: "",
    },
    validate: {
      name: (value) => (value ? null : "Le nom est requis."),
    },
  });

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
              isActiveProps={{
                w: "100%",
                checked: !!form.getInputProps("isActive").value,
                ...form.getInputProps(`isActive`),
              }}
              nameProps={{
                w: "100%",
                ...form.getInputProps(`name`),
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
