export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(text: string | null) {
  if (text === null) return false;
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

export function capitalize(string: string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export const V_SEPARATOR = "｜";

/**
 * Remove diacritics and apply toLowerCase()
 */
export function normalizeString(string: string) {
  return string
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function isMobile() {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
  });
}

export const removeParametersFromUrl = (url: string): string =>
  url.split("?")[0];

export const formatFrenchPrice = (price: number): string =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  })
    .format(price)
    .replace(",00", "");

export type Boolean3ChoicesFormValue = "true" | "false" | "";

export const boolean3ChoicesFormValueToBool = (
  value: string,
): boolean | null => {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "") return null;
  throw new Error("Unexpected value: " + value);
};

export const boolean3ChoicesToFormValue = (
  value: boolean | null,
): Boolean3ChoicesFormValue => {
  if (value === null || value === undefined) return "";
  if (value) return "true";
  if (!value) return "false";
  throw new Error("Unexpected value: " + value);
};
