import { fbAppId } from "@/domain/constants";
import { getGigTitleFromGigSlug } from "@/domain/Gig/Gig.service";
import { GigWithBandsAndPlace } from "@/domain/Gig/Gig.type";
import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

/**
 *Get app metadata. If a title is provided, it automatically appends the suffix " ║ Larsen Toulousaine"
 * @param {Metadata} metadata
 * @param {OpenGraph} openGraph
 * @returns {Metadata}
 */
export const getMetadata = (
  metadata?: Omit<Metadata, "openGraph">,
  openGraph?: OpenGraph,
): Metadata => {
  const { title: metadataTitle, ...metadataWithoutTitle } = metadata || {};
  let title = metadataTitle;
  if (typeof title === "string") {
    title += " ║ Larsen Toulousaine";
  }
  return {
    applicationName: "Larsen Toulousaine",
    description: "Votre agenda des concerts et festivals metal à Toulouse",
    icons: { icon: "icon.png" },
    manifest: "/manifest.json",
    title:
      title ||
      "Larsen Toulousaine, votre agenda des concerts et festivals metal à Toulouse.",
    ...metadataWithoutTitle,
    openGraph: {
      siteName: "Larsen Toulousaine",
      type: "website",
      images: `${process.env.NEXT_PUBLIC_URL}/icon.png`,
      ...openGraph,
    },
    other: {
      "fb:app_id": fbAppId,
    },
  };
};

export const getGigsMetadata = (
  gigs: GigWithBandsAndPlace[],
): { gigDescriptions: string[]; gigImages: string[] } => {
  const filteredGigs = gigs.filter((g) => !g.isCanceled);
  const images: string[] = filteredGigs.reduce((images, gig) => {
    if (!gig.imageUrl) return images;
    return [...images, gig.imageUrl];
  }, []);
  const descriptions = filteredGigs.map(
    (gig) => getGigTitleFromGigSlug(gig.slug) + " - " + gig.place.name,
  );
  return {
    gigDescriptions: descriptions,
    gigImages: images,
  };
};
