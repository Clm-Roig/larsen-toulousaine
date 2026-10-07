import AddButton, { AddButtonProps } from "@/components/AddButton";

type Props = {
  type: "genre" | "gig" | "organization" | "place";
} & AddButtonProps;

export default function AddResourceButton({ type, ...addButtonProps }: Props) {
  switch (type) {
    case "genre":
      return (
        <AddButton
          href="/admin/ajout-genre"
          label="Ajouter un genre"
          {...addButtonProps}
        />
      );
    case "gig":
      return (
        <AddButton
          href="/admin/ajout-concert"
          label="Ajouter un concert"
          {...addButtonProps}
        />
      );
    case "organization":
      return (
        <AddButton
          href="/admin/ajout-asso"
          label="Ajouter une association"
          {...addButtonProps}
        />
      );
    case "place":
      return (
        <AddButton
          href="/admin/ajout-lieu"
          label="Ajouter un lieu"
          {...addButtonProps}
        />
      );
    default:
      return null;
  }
}
