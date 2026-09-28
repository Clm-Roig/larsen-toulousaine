import AddButton, { AddButtonProps } from ".";

export default function AddGenreButton({ ...addButtonProps }: AddButtonProps) {
  return (
    <AddButton
      href="/admin/ajout-genre"
      label="Ajouter un genre"
      {...addButtonProps}
    />
  );
}
