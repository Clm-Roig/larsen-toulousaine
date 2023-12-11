import { gigListOrderBy } from "@/app/api/utils/gigs";
import { getGigRSSFeedDescription } from "@/domain/Gig/Gig.service";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import RSS, { FeedOptions } from "rss";

import "dayjs/locale/fr";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
// dayjs configuration
dayjs.locale("fr");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/Paris");

export async function GET() {
  const feedOptions: FeedOptions = {
    title: "Larsen Toulousaine",
    description: "Liste des concerts référencés par Larsen Toulousaine",
    feed_url: `${process.env.NEXT_PUBLIC_URL}/feed.xml`,
    site_url: process.env.NEXT_PUBLIC_URL + "",
    language: "fr",
    image_url: `${process.env.NEXT_PUBLIC_URL}/images/icon.png`,
    categories: ["musique"],
  };
  const feed = new RSS(feedOptions);

  const allGigs = await prisma.gig.findMany({
    include: {
      place: true,
      bands: {
        include: {
          band: {
            include: {
              genres: true,
            },
          },
        },
      },
    },
    orderBy: gigListOrderBy,
  });
  const cleanedGigs = allGigs.map((gig) => ({
    ...gig,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    bands: gig.bands.map((b) => ({ ...b.band, order: b.order })),
  }));

  cleanedGigs.map((gig) => {
    feed.item({
      title:
        dayjs.tz(gig.date).format("DD/MM/YYYY") +
        " : " +
        gig.bands?.map((b) => b.name).join(" | "),
      date: gig.createdAt,
      description: getGigRSSFeedDescription(gig),
      url: gig.slug,
      guid: gig.slug,
      ...(gig.imageUrl
        ? {
            enclosure: {
              url: gig.imageUrl,
            },
          }
        : {}),
    });
  });

  const twoMinutesInSeconds = 120;

  return new Response(feed.xml({ indent: true }), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${twoMinutesInSeconds}`,
    },
  });
}
