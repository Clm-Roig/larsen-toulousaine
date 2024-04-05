import { getBandNames, getSortedGenres } from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { MAIN_CITY } from "@/domain/Place/constants";
import { V_SEPARATOR, capitalize } from "@/utils/utils";
import { Band, Gig, Place } from "@prisma/client";
import dayjs from "@/lib/dayjs";

/**
 * If the gig as a name, the slug is "YEAR_NAME" (ex: 2024_echos-et-merveilles)
 * Else, the slug is "DAY-MONTH-YEAR_BANDNAMES" (ex: 05-01-2024_metallica-ghost)
 */
export const computeGigSlug = (gig: {
  bands: { name: Band["name"] }[];
  date: Gig["date"];
  name: Gig["name"];
}): string => {
  const normalizeString = (str: string) =>
    str.toLowerCase().replaceAll(" ", "-");
  const { bands, date, name } = gig;
  const dateObj = dayjs(date).tz("Europe/Paris");
  if (name) {
    return `${dateObj.format("YYYY")}_${normalizeString(name)}`;
  }
  const dateString = dateObj.format("DD-MM-YYYY");
  const bandsString = bands.map((band) => normalizeString(band.name)).join("_");
  return dateString + "_" + bandsString;
};

export const getDataFromGigSlug = (
  slug: string,
): {
  bandNames: string[];
  date: string;
  dateObject: Date;
  name: string | null;
} => {
  const splittedSlug = slug.split("_");
  const date = splittedSlug[0];

  const slugPartToString = (slug: string): string =>
    slug
      .split("-")
      .map((w) => capitalize(w))
      .join(" ");

  // 4 characters = gig year = gig has a name (it's a festival)
  const name = date.length === 4 ? slugPartToString(splittedSlug[1]) : null;

  const bandNames = splittedSlug
    .slice(1)
    .map((bandName) => slugPartToString(bandName));
  const parts = date.split("-");
  const year = parseInt(parts[2], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript Date object
  const day = parseInt(parts[0], 10);
  const dateObject = new Date(year, month, day);
  return { bandNames, date, dateObject, name };
};

export const getGigTitleFromGigSlug = (slug: string) => {
  const { date, bandNames, name } = getDataFromGigSlug(slug);
  if (name) {
    return `${name} ${date}`;
  } else {
    return `${date} - ${bandNames.join(V_SEPARATOR)}`;
  }
};

export const getGigTitle = (gig: GigWithBandsAndPlace): string => {
  const { bands, name } = gig;
  return name !== null ? name : getBandNames(bands);
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
  const { bands, name, place, price, ticketReservationLink } = gig;

  const getNewLine = () => {
    return description === "" ? "" : "<br />";
  };

  // Name or bands
  if (name) {
    description += name;
  } else if (bands) {
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

export type HasTicketLinkFormValue = "true" | "false" | "";
export const hasTicketLinkFormValueToBool = (value: string): boolean | null => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "") return null;
  throw new Error("Unexpected value: " + value);
};
export const hasTicketLinkBoolToFormValue = (
  value: Gig["hasTicketReservationLink"],
): HasTicketLinkFormValue => {
  if (value === null || value === undefined) return "";
  if (value) return "true";
  if (!value) return "false";
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  throw new Error("Unexpected value: " + value);
};

// ===== To Markdown utils ===== //

const getGigMarkdownTitle = (gig: GigWithBandsAndPlace): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  const allBandGenres = gig.bands.flatMap((b: any) => b.genres);
  return `${getGigTitle(gig)} (${getSortedGenres(allBandGenres)
    .slice(0, 3)
    .map((g) => g.name)
    .join(", ")})`;
};

const getGigMarkdownDate = (date: Date): string =>
  `📅 ${capitalize(dayjs(date).format("dddd DD MMMM"))}`;

const getGigMarkdownPlace = (place: Place): string =>
  `📍 ${place.name}${place.name !== MAIN_CITY ? `, (${place.city})` : ""}`;

const getGigMarkdownPrice = (price: Gig["price"]): string =>
  `💸 ${price === 0 ? `Prix libre` : `${price}€`}`;

export const toDiscordMarkdown = (
  gig: GigWithBandsAndPlace,
  lineBreakSymbol: string,
) => {
  const { date, place, price, slug } = gig;
  const lines: string[] = [];
  lines.push(`**${getGigMarkdownTitle(gig)}**`);
  lines.push(getGigMarkdownDate(date));
  lines.push(getGigMarkdownPlace(place));
  lines.push(getGigMarkdownPrice(price));
  // TODO: larsen-toulousaine.fr must be an environment variable
  lines.push(`[Plus d'infos](https://larsen-toulousaine.fr/${slug})`);
  return lines.map((line) => `> ${line}`).join(lineBreakSymbol);
};

export const toFacebookMarkdown = (
  gig: GigWithBandsAndPlace,
  lineBreakSymbol: string,
) => {
  const { date, facebookEventUrl, place, price } = gig;
  const lines: string[] = [];
  lines.push(getGigMarkdownTitle(gig));
  lines.push(getGigMarkdownDate(date));
  lines.push(getGigMarkdownPlace(place));
  lines.push(getGigMarkdownPrice(price));
  lines.push(`${facebookEventUrl}`);
  return lines.map((line) => `${line}`).join(lineBreakSymbol);
};
