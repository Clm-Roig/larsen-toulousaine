import { allBands, allPlaces, allUsers } from "@/tests/data";

export const gigBands = allBands
  .slice(0, 2)
  .map((b, idx) => ({ ...b, order: idx + 1 }));

export const gig = {
  id: "oiqdkjioaz8549849d8",
  bands: gigBands.map((b, idx) => ({ ...b, order: idx + 1 })),
  date: new Date(),
  place: allPlaces[1],
  createdAt: new Date(),
  updatedAt: new Date(),
  isCanceled: false,
  title: null,
  name: null,
  authorId: allUsers[0].id,
  description: null,
  placeId: allPlaces[1].id,
  slug: "random slug",
  imageUrl: null,
  ticketReservationLink:
    "https://ticketreservationlink.com/gig/123214465476456",
  price: 3,
  isSoldOut: false,
};
