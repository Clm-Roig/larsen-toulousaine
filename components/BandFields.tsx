import GenreSelect, { GenreSelectProps } from "@/components/GenreSelect";
import { MAX_GENRES_PER_BAND } from "@/domain/Band/constants";
import {
  Checkbox,
  CheckboxProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";

type Props = {
  genreProps: Omit<GenreSelectProps, "maxValues" | "placeholder">;
  isLocalProps: Omit<CheckboxProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
  withShortIsLocalDescription?: boolean;
};

const genreLabel = `Genres (${MAX_GENRES_PER_BAND} max)`;
const isLocalLabel = "Est un groupe local";
const nameLabel = "Nom du groupe";

export default function BandFields({
  genreProps,
  isLocalProps,
  nameProps,
  withLabels = false,
  withShortIsLocalDescription = false,
}: Props) {
  return (
    <>
      <TextInput
        {...nameProps}
        required
        {...(withLabels ? { label: nameLabel } : { placeholder: nameLabel })}
      />
      <GenreSelect
        {...genreProps}
        maxValues={MAX_GENRES_PER_BAND}
        {...(withLabels ? { label: genreLabel } : { placeholder: genreLabel })}
      />
      <Checkbox
        {...isLocalProps}
        label={isLocalLabel}
        description={
          withShortIsLocalDescription
            ? "< 100km de Toulouse"
            : "Un groupe est considéré comme local s'il se situe à moins de 100km de Toulouse. Cela inclut des villes comme Agen, Montauban, Albi, Cahors, Carcassonne, Foix ou Auch par exemple."
        }
      />
    </>
  );
}
