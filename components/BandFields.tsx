import CountrySelect from "@/components/CountrySelect";
import GenreSelect, { GenreSelectProps } from "@/components/GenreSelect";
import RegionSelect from "@/components/RegionSelect";
import { MAX_GENRES_PER_BAND } from "@/domain/Band/constants";
import {
  Checkbox,
  CheckboxProps,
  InputProps,
  SelectProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";

type Props = {
  cityProps?: InputProps;
  countryCodeProps?: SelectProps;
  genreProps: Omit<GenreSelectProps, "maxValues" | "placeholder">;
  isLocalProps: Omit<CheckboxProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  regionCodeProps?: SelectProps;
  withLabels?: boolean;
  withShortIsLocalDescription?: boolean;
};

const cityLabel = "Ville";
const countryCodeLabel = `Pays`;
const genreLabel = `Genres (${MAX_GENRES_PER_BAND} max)`;
const isLocalLabel = "Est un groupe local";
const nameLabel = "Nom du groupe";
const regionCodeLabel = `Région`;

export default function BandFields({
  cityProps,
  countryCodeProps,
  genreProps,
  isLocalProps,
  nameProps,
  regionCodeProps,
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
      {countryCodeProps && (
        <CountrySelect
          {...countryCodeProps}
          {...(withLabels
            ? { label: countryCodeLabel }
            : { placeholder: countryCodeLabel })}
        />
      )}
      {regionCodeProps && (
        <RegionSelect
          countryCode={countryCodeProps?.value}
          {...regionCodeProps}
          {...(withLabels
            ? { label: regionCodeLabel }
            : { placeholder: regionCodeLabel })}
        />
      )}
      <TextInput
        {...cityProps}
        {...(withLabels ? { label: cityLabel } : { placeholder: cityLabel })}
      />
    </>
  );
}
