import AddButton, { AddButtonProps } from ".";

export default function AddGigButton({ ...addButtonProps }: AddButtonProps) {
  return (
    <AddButton
      href="/admin/ajout-concert"
      label="Ajouter un concert"
      {...addButtonProps}
    />
  );
}
