import { Band, Genre, Gig } from "@prisma/client";
import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";
import api, { getErrorMessage } from "@/lib/axios";
import { BandWithGenres } from "@/domain/Band/Band.type";

export const getGigs = async (
  from: Date,
  to: Date,
): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?from=${from.toString()}&to=${to.toString()}`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGig = async (
  idOrSlug: string,
): Promise<(GigWithBandsAndPlace & GigWithAuthor) | null> => {
  try {
    const response = await api.get<
      (GigWithBandsAndPlace & GigWithAuthor) | undefined
    >(`/gigs/${encodeURIComponent(idOrSlug)}`);
    return response.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type CreateGigArgs = Omit<
  Gig,
  "id" | "createdAt" | "authorId" | "updatedAt" | "isCanceled"
> & {
  bands: Array<
    Omit<Band, "id" | "genres"> & {
      id?: BandWithGenres["id"] | undefined;
      key: string; // needed by the add gig form
      genres: Array<Genre["id"]>;
      order: number;
    }
  >;
};

export const createGig = async (
  gig: CreateGigArgs,
): Promise<GigWithBandsAndPlace> => {
  try {
    const response = await api.post<GigWithBandsAndPlace>(`/gigs`, gig);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
