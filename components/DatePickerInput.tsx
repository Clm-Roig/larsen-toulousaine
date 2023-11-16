import {
  DatePickerInput as MantineDatePickerInput,
  DatePickerInputProps,
} from "@mantine/dates";

type Props = DatePickerInputProps;

export default function DatePickerInput(inputProps: Props) {
  return <MantineDatePickerInput {...inputProps} />;
}
