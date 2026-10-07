import AddButton, { AddButtonProps } from ".";

export default function AddOrganizationButton({
  ...addButtonProps
}: AddButtonProps) {
  return (
    <AddButton
      href="/admin/ajout-asso"
      label="Ajouter une association"
      {...addButtonProps}
    />
  );
}
