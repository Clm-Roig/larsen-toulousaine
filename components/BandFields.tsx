import GenreSelect, { GenreSelectProps } from "@/components/GenreSelect";
import { MAX_GENRES_PER_BAND } from "@/domain/Band/constants";
import { TextInput, TextInputProps } from "@mantine/core";

type Props = {
  genreProps: Omit<GenreSelectProps, "maxValues" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  withLabels?: boolean;
};

const genreLabel = `Genres (${MAX_GENRES_PER_BAND} max)`;
const nameLabel = "Nom du groupe";
export default function BandFields({
  genreProps,
  nameProps,
  withLabels = false,
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
    </>
  );
}
