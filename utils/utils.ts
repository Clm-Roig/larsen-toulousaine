export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
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
