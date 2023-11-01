import { Band } from "../Band/Band.type";
import { Place } from "../Place/Place.type";

export type Gig = {
  id?: string;
  title?: string | null;
  date: string;
  author?: {
    pseudo: string;
    email: string;
  } | null;
  bands: Band[];
  description: string | null;
  place: Place;
  createdAt: string;
  updatedAt: string;
};
