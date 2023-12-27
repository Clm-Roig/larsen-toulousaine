import AddButton, { AddButtonProps } from ".";

export default function AddPlaceButton({ ...addButtonProps }: AddButtonProps) {
  return (
    <AddButton
      href="/admin/ajout-lieu"
      label="Ajouter un lieu"
      {...addButtonProps}
    />
  );
}
