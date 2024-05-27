import {
  getBandNames,
  getSortedGenres,
  getSortedUniqueBandGenres,
} from "@/domain/Band/Band.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { MAIN_CITY } from "@/domain/Place/constants";
import { V_SEPARATOR, capitalize, formatFrenchPrice } from "@/utils/utils";
import { Band, Gig, Place } from "@prisma/client";
import dayjs from "@/lib/dayjs";

const slugReplacements: { replaced: string; replacer: string }[] = [
  { replaced: " ", replacer: "-" },
  { replaced: "/", replacer: "|" },
];

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
    slugReplacements.reduce(
      (res, { replaced, replacer }) => res.replaceAll(replaced, replacer),
      str.toLowerCase(),
    );
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
      // slugReplacements[0] equivalent with capitalize added
      .split("-")
      .map((w) => capitalize(w))
      .join(" ")
      // ==========
      // slugReplacements[1]
      .replaceAll(slugReplacements[1].replacer, slugReplacements[1].replaced);

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
  const priceString = formatGigPrice("Prix : ", price);
  if (priceString !== "") {
    description += `${getNewLine()}${priceString}`;
  }

  // Bottom signature
  description += `${getNewLine()}[i]Évènement créé par Larsen Toulousaine, votre agenda metal toulousain[/i]`;
  return description;
};

export const formatGigPrice = (prefix: string, price: Gig["price"]): string => {
  let res = prefix;
  if (price === 0) res += "Prix libre ou gratuit";
  else if (!price) res += "Inconnu";
  else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    res += formatFrenchPrice(price);
  }
  return res;
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
  const priceString = formatGigPrice("Prix : ", price);
  if (priceString !== "") {
    description += `${getNewLine()}${priceString}`;
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
  return `${getGigTitle(gig)} (${getSortedUniqueBandGenres(gig.bands)
    .slice(0, 3)
    .map((g) => g.name)
    .join(", ")})`;
};

const markdownPricePrefix = `💸 `;
const markdownDatePrefix = `📅 `;
const markdownPlacePrefix = `📍 `;

const getGigMarkdownDate = (date: Date, endDate?: Date | null): string =>
  `${markdownDatePrefix}${capitalize(dayjs(date).tz().format("dddd DD MMMM"))}${endDate ? ` au ${dayjs(endDate).tz().format("dddd DD MMMM")}` : ""}`;

const getGigMarkdownPlace = (place: Place): string =>
  `${markdownPlacePrefix}${place.name}${place.city === MAIN_CITY ? "" : ` (${place.city})`}`;

export const toDiscordMarkdown = (
  gig: GigWithBandsAndPlace,
  lineBreakSymbol: string,
) => {
  const { date, endDate, place, price, slug } = gig;
  const lines: string[] = [];
  lines.push(`**${getGigMarkdownTitle(gig)}**`);
  lines.push(getGigMarkdownDate(date, endDate));
  lines.push(getGigMarkdownPlace(place));
  lines.push(formatGigPrice(markdownPricePrefix, price));
  lines.push(`[Plus d'infos](${process.env.NEXT_PUBLIC_URL}/${slug})`);
  return lines.map((line) => `> ${line}`).join(lineBreakSymbol);
};

export const toFacebookMarkdown = (
  gig: GigWithBandsAndPlace,
  lineBreakSymbol: string,
) => {
  const { date, endDate, facebookEventUrl, place, price } = gig;
  const lines: string[] = [];
  lines.push(getGigMarkdownTitle(gig));
  lines.push(getGigMarkdownDate(date, endDate));
  lines.push(getGigMarkdownPlace(place));
  lines.push(formatGigPrice(markdownPricePrefix, price));
  if (facebookEventUrl) {
    lines.push(`${facebookEventUrl}`);
  }
  return lines.map((line) => `${line}`).join(lineBreakSymbol);
};
