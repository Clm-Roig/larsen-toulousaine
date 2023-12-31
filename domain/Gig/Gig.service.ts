import { getSortedGenres } from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { MAIN_CITY } from "@/domain/Place/constants";
import { V_SEPARATOR, capitalize } from "@/utils/utils";
import { Band, Gig } from "@prisma/client";
import dayjs from "@/lib/dayjs";

export const computeGigSlug = (gig: {
  bands: { name: Band["name"] }[];
  date: Gig["date"];
}): string => {
  const { bands, date } = gig;
  const dateString = dayjs(date).tz("Europe/Paris").format("DD-MM-YYYY");
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
  return { date, bandNames };
};

export const getGigTitleFromGigSlug = (slug: string) => {
  const { date, bandNames } = getDataFromGigSlug(slug);
  return date + " - " + bandNames.join(V_SEPARATOR);
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

  // Price
  const priceString = getPriceString(price);
  if (priceString !== "") {
    description += `${getNewLine()}Prix : ${priceString}`;
  }

  // Bottom signature
  description += `${getNewLine()}[i]Évènement créé par Larsen Toulousaine, votre agenda metal toulousain[/i]`;
  return description;
};

export const getGigRSSFeedDescription = (gig: GigWithBandsAndPlace): string => {
  let description = "";
  const { bands, place, price, ticketReservationLink } = gig;

  const getNewLine = () => {
    return description === "" ? "" : "<br />";
  };

  // Bands
  if (bands) {
    const formattedBands = bands.map(
      (b) =>
        `${b.name} (${getSortedGenres(b.genres)
          .map((g) => g.name)
          .join(", ")})`,
    );
    description += formattedBands.join(" - ");
  }

  // Price
  const priceString = getPriceString(price);
  if (priceString !== "") {
    description += `${getNewLine()}Prix : ${priceString}`;
  }

  // Ticket reservation link
  if (ticketReservationLink) {
    description += `${getNewLine()}Ticket : <a href="${ticketReservationLink}">${ticketReservationLink}</a>`;
  }

  // Place
  if (place?.name) {
    description += `${getNewLine()}Lieu : ${place.name}${
      place.city !== MAIN_CITY ? ` (${place.city})` : ""
    }`;
  }

  return description;
};

export const getPriceString = (price?: number | null): string => {
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
  return priceString;
};
