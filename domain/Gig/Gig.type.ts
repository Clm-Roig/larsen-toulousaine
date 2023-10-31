import { Place } from "../Place/Place.type";

export type Gig = {
  id?: string;
  title?: string | null;
  date: string;
  author?: {
    pseudo: string;
    email: string;
  } | null;
  bands: string[];
  description: string | null;
  place: Place;
  createdAt: string;
  updatedAt: string;
};
