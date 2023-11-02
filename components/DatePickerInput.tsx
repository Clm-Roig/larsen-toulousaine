import {
  DatePickerInput as MantineDatePickerInput,
  DatePickerInputProps,
  DatesProvider,
} from "@mantine/dates";
import "dayjs/locale/fr";

type Props = DatePickerInputProps;

export default function DatePickerInput(inputProps: Props) {
  return (
    <DatesProvider
      settings={{
        locale: "fr",
        timezone: "UTC",
      }}
    >
      <MantineDatePickerInput {...inputProps} />
    </DatesProvider>
  );
}
