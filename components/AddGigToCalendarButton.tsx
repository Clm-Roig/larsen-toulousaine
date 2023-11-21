import { getBandNames } from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { useMantineTheme } from "@mantine/core";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";
import dayjs from "dayjs";

type Props = {
  gig: GigWithBandsAndPlace;
} & AddToCalendarButtonType;

export default function AddGigToCalendarButton({
  gig,
  ...calendarProps
}: Props) {
  const theme = useMantineTheme();
  const style = `--btn-underline: ${theme.colors.primary[6]};`;
  const { bands, date, imageUrl, place, price, ticketReservationLink } =
    gig || {};
  const bandNames = getBandNames(bands || []);
  const name = `Concert : ${bandNames}`;
  const iCalName = `Concert ${bandNames}`; // remove the ":" for file name
  return (
    <AddToCalendarButton
      label="Ajouter à mon agenda"
      language="fr"
      buttonStyle="text"
      size="3|3|2"
      hideIconButton
      hideCheckmark
      styleLight={style}
      styleDark={style}
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
      endDate={dayjs(date).format("YYYY-MM-DD")}
      timeZone="America/Los_Angeles"
      images={imageUrl ? [imageUrl] : []}
      // Apple doesn't support most of html markdown (<i>, <p>, <ul>). That's it's using <br />, which is supported, to break lines.
      description={`${
        ticketReservationLink && `Ticket : [url]${ticketReservationLink}[/url]`
      }${
        price &&
        `[br][br]Prix : ${price === 0 ? "Prix libre ou gratuit" : `${price}€`}`
      }[br][br][i]Évènement créé par Décibel, votre agenda metal toulousain[/i]`}
      {...calendarProps}
    />
  );
}
