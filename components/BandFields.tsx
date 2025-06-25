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
  isATributeProps: Omit<CheckboxProps, "required" | "placeholder">;
  isLocalProps: Omit<CheckboxProps, "required" | "placeholder">;
  isSafeProps: Omit<CheckboxProps, "required" | "placeholder">;
  nameProps: Omit<TextInputProps, "required" | "placeholder">;
  regionCodeProps?: SelectProps;
  withLabels?: boolean;
  withShortBoolDescriptions?: boolean;
};

const cityLabel = "Ville";
const countryCodeLabel = `Pays`;
const genreLabel = `Genres (${MAX_GENRES_PER_BAND} max)`;
const isATributeLabel = "Est un groupe tribute";
const isLocalLabel = "Est un groupe local";
const isSafeLabel = "Est un groupe safe";
const nameLabel = "Nom du groupe";
const regionCodeLabel = `Région`;

export default function BandFields({
  cityProps,
  countryCodeProps,
  genreProps,
  isATributeProps,
  isLocalProps,
  isSafeProps,
  nameProps,
  regionCodeProps,
  withLabels = false,
  withShortBoolDescriptions = false,
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
          withShortBoolDescriptions
            ? "< 100km de Toulouse"
            : "Un groupe est considéré comme local s'il se situe à moins de 100km de Toulouse. Cela inclut des villes comme Agen, Montauban, Albi, Cahors, Carcassonne, Foix ou Auch par exemple."
        }
      />
      <Checkbox
        {...isATributeProps}
        label={isATributeLabel}
        description={
          withShortBoolDescriptions
            ? "Fait des reprises uniquement"
            : "Le groupe fait uniquement des reprises d'autre(s) groupe(s) (généralement très connu(s))."
        }
      />
      <Checkbox
        {...isSafeProps}
        label={isSafeLabel}
        description={
          withShortBoolDescriptions
            ? ""
            : `Quand un groupe est marqué comme "non-safe", les concerts auxquels il participe sont alors masqués. Le fait de changer cette valeur doit avoir été approuvé par plusieurs modérateur·rices ainsi que par Clément.`
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
      {cityProps && (
        <TextInput
          {...cityProps}
          {...(withLabels ? { label: cityLabel } : { placeholder: cityLabel })}
        />
      )}
    </>
  );
}
