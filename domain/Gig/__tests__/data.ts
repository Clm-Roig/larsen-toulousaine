import { allBands, allPlaces, allUsers } from "@/tests/data";
import { GigWithBandsAndPlace } from "../Gig.type";

export const gigBands = allBands
  .slice(0, 2)
  .map((b, idx) => ({ ...b, order: idx + 1 }));

export const gig: GigWithBandsAndPlace = {
  id: "oiqdkjioaz8549849d8",
  authorId: allUsers[0].id,
  bands: gigBands.map((b, idx) => ({ ...b, order: idx + 1 })),
  createdAt: new Date(),
  date: new Date(),
  description: null,
  imageUrl: null,
  isCanceled: false,
  isSoldOut: false,
  name: null,
  place: allPlaces[1],
  placeId: allPlaces[1].id,
  price: 3,
  slug: "random slug",
  ticketReservationLink:
    "https://ticketreservationlink.com/gig/123214465476456",
  title: null,
  updatedAt: new Date(),
  endDate: null,
  facebookEventUrl: null,
  hasTicketReservationLink: true,
  isAcceptingBankCard: null,
};
