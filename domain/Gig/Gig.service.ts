import { capitalize } from "@/utils/utils";
import { Band, Gig } from "@prisma/client";
import dayjs from "dayjs";

export const computeGigSlug = (gig: {
  bands: { name: Band["name"] }[];
  date: Gig["date"];
}): string => {
  const { bands, date } = gig;
  const dateString = dayjs(date).format("DD-MM-YYYY");
  const bandsString = bands
    .map((band) => band.name.toLowerCase().replaceAll(" ", "-"))
    .join("_");
  return dateString + "_" + bandsString;
};

export const getDataFromGigSlug = (
  slug: string,
): { date: string; bandNames: string[] } => {
  const splittedSlug = slug.split("_");
  const date = splittedSlug[0];
  const bandNames = splittedSlug.slice(1).map((bandName) =>
    bandName
      .split("-")
      .map((w) => capitalize(w))
      .join(" "),
  );
  return { date: date, bandNames: bandNames };
};

/**
 * Description with partial HTML support for https://add-to-calendar-button.com/
 * Apple doesn't support most of html markdown (<i>, <p>, <ul>). That's it's using <br />, which is supported, to break lines.
 */
export const getGigCalendarDescription = (gig: Gig): string => {
  let description = "";
  const { price, ticketReservationLink } = gig;

  const getNewLine = () => {
    return description === "" ? "" : "[br][br]";
  };

  // Ticket reservation link
  if (ticketReservationLink) {
    description += `Ticket : [url]${ticketReservationLink}[/url]`;
  }

  // Price handling
  let priceString = "";
  if (price === 0) {
    priceString = "libre ou gratuit";
  }
  if (price) {
    priceString = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    })
      .format(price)
      .replace(",00", "");
  }
  if (priceString !== "") {
    description += `${getNewLine()}Prix : ${priceString}`;
  }

  // Bottom signature
  description += `${getNewLine()}[i]Évènement créé par Décibel, votre agenda metal toulousain[/i]`;
  return description;
};
