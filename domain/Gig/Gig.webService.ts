import { Band, Genre, Gig } from "@prisma/client";
import { GigWithBandsAndPlace } from "./Gig.type";
import api, { getErrorMessage } from "@/lib/axios";
import { BandWithGenres } from "@/domain/Band/Band.type";

export const getGigs = async (
  from: Date,
  to: Date,
): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?from=${from.toISOString()}&to=${to.toISOString()}`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGigByDateAndPlaceId = async (
  date: Date,
  placeId: string,
): Promise<GigWithBandsAndPlace | null> => {
  try {
    const response = await api.get<GigWithBandsAndPlace | undefined>(
      `/gigs?date=${date.toISOString()}&placeId=${placeId}`,
    );
    return response.data ?? null;
  } catch (error) {
    if (error.response.status === 404) return null;
    throw new Error(getErrorMessage(error));
  }
};

export const getGig = async (
  slug: string,
): Promise<GigWithBandsAndPlace | null> => {
  try {
    const response = await api.get<GigWithBandsAndPlace | undefined>(
      `/gigs/${encodeURIComponent(slug)}`,
    );
    return response.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getNextGigSlug = async (
  slug: string,
): Promise<Gig["slug"] | null> => {
  try {
    const response = await api.get<Gig["slug"] | undefined>(
      `/gigs/${encodeURIComponent(slug)}/next`,
    );
    return response.data ?? null;
  } catch (error) {
    if (error.response.status === 404) return null;
    throw new Error(getErrorMessage(error));
  }
};

export const getPreviousGigSlug = async (
  slug: string,
): Promise<Gig["slug"] | null> => {
  try {
    const response = await api.get<Gig["slug"] | undefined>(
      `/gigs/${encodeURIComponent(slug)}/previous`,
    );
    return response.data ?? null;
  } catch (error) {
    if (error.response.status === 404) return null;
    throw new Error(getErrorMessage(error));
  }
};

export type CreateGigArgs = Omit<
  Gig,
  "id" | "createdAt" | "authorId" | "updatedAt" | "isCanceled" | "isSoldOut"
> & {
  id?: string;
  createdAt?: Date;
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
    const response = await api.post<GigWithBandsAndPlace>(`/gigs`, {
      ...gig,
      date: gig.date.toISOString(), // serialize date to not lose timezone info
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type EditGigArgs = Gig & {
  bands: Array<
    Omit<Band, "id" | "genres"> & {
      id: BandWithGenres["id"];
      genres: Array<Genre["id"]>;
      order: number;
    }
  >;
};

export const editGig = async (
  gig: EditGigArgs,
): Promise<GigWithBandsAndPlace> => {
  try {
    const response = await api.put<GigWithBandsAndPlace>(`/gigs/${gig.id}`, {
      ...gig,
      date: gig.date.toISOString(), // serialize date to not lose timezone info
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteGig = async (gigSlug: Gig["slug"]): Promise<void> => {
  try {
    await api.delete(`/gigs/${gigSlug}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const cancelGig = async (gigSlug: Gig["slug"]): Promise<void> => {
  try {
    await api.post(`/gigs/${gigSlug}/cancel`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const uncancelGig = async (gigSlug: Gig["slug"]): Promise<void> => {
  try {
    await api.post(`/gigs/${gigSlug}/uncancel`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const markGigAsSoldOut = async (gigSlug: Gig["slug"]): Promise<void> => {
  try {
    await api.post(`/gigs/${gigSlug}/markAsSoldOut`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const markGigAsNotSoldOut = async (
  gigSlug: Gig["slug"],
): Promise<void> => {
  try {
    await api.post(`/gigs/${gigSlug}/markAsNotSoldOut`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const searchGigs = async (
  query: string,
): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?query=${query}`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
