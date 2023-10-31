import { Place } from "./Place.type";

export type Gig = {
  id: string;
  title: string;
  date: string;
  author: {
    pseudo: string;
    email: string;
  } | null;
  bands: string[];
  description: string;
  published: boolean;
  place: Place;
};
