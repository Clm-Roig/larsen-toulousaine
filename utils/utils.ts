import { fbAppId } from "@/domain/constants";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

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

export const getMetadata = (
  metadata: Omit<Metadata, "openGraph">,
  openGraph?: OpenGraph,
): Metadata => ({
  applicationName: "Larsen Toulousaine",
  icons: "icon.png",
  manifest: "/manifest.json",
  ...metadata,
  openGraph: {
    siteName: "Larsen Toulousaine",
    type: "website",
    images: "https://larsen-toulousaine.fr/icon.png",
    ...openGraph,
  },
  other: {
    "fb:app_id": fbAppId,
  },
});

export const removeParametersFromUrl = (url: string): string =>
  url.split("?")[0];
