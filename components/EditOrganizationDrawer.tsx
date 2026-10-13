import { Drawer, DrawerProps } from "@mantine/core";
import { Organization } from "@prisma/client";
import { EditOrganizationArgs } from "@/domain/Organization/Organization.webService";
import OrganizationForm from "@/components/OrganizationForm";

type Props = {
  editedOrganization: Organization | null;
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
  return (
    <Drawer
      {...drawerProps}
      onClose={handleOnClose}
      position="right"
      title="Modifier l'association"
    >
      {editedOrganization && (
        <OrganizationForm
          key={editedOrganization.id}
          initialValues={editedOrganization}
          isLoading={isPending}
          onSubmit={handleOnSubmit}
        />
      )}
    </Drawer>
  );
}
