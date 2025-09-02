import {
  getGigCalendarDescription,
  getGigTitle,
} from "@/domain/Gig/Gig.service";
import {
  GigWithBandsAndPlace,
  gigToGigTypeString,
} from "@/domain/Gig/Gig.type";
import { useComputedColorScheme, useMantineTheme } from "@mantine/core";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";
import dayjs from "@/lib/dayjs";

type Props = {
  gig: GigWithBandsAndPlace;
} & AddToCalendarButtonType;

export default function AddGigToCalendarButton({
  gig,
  ...calendarProps
}: Props) {
  const theme = useMantineTheme();
  const computedColorSchem = useComputedColorScheme("light");
  const style = `--btn-underline: ${theme.colors.primary[6]} !important;`;
  const { date, endDate, imageUrl, place } = gig || {};
  const gigTitle = getGigTitle(gig);
  const gigType = gigToGigTypeString(gig);
  const name = `${gigType} : ${gigTitle}`;
  const iCalName = `${gigType} ${gigTitle}`; // remove the ":" for file name
  return (
    <AddToCalendarButton
      label="Ajouter à l'agenda"
      language="fr"
      buttonStyle="text"
      size="3|3|2"
      hideIconButton
      hideCheckmark
      styleLight={style}
      styleDark={style}
      lightMode={computedColorSchem}
      name={name}
      iCalFileName={iCalName}
      options={[
        "Google",
        "Apple",
        "iCal",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ]}
      location={
        place?.address
          ? `${place?.name}, ${place?.address}, ${place.city}`
          : undefined
      }
      startDate={dayjs(date).format("YYYY-MM-DD")}
      endDate={dayjs(endDate ? endDate : date).format("YYYY-MM-DD")}
      timeZone="Europe/Paris"
      images={imageUrl ? [imageUrl] : []}
      description={getGigCalendarDescription(gig)}
      {...calendarProps}
    />
  );
}
