import { Band, Genre, Gig } from "@prisma/client";
import {
  GigMinimal,
  GigPreview,
  GigWithBandsAndPlace,
  MarkdownGigs,
} from "./Gig.type";
import api, { getErrorMessage } from "@/lib/axios";
import { BandPreview, BandWithGenres } from "@/domain/Band/Band.type";
import { isAxiosError } from "axios";

export const getGigs = async (
  from: Date,
  to: Date,
  askForMarkdown = false,
): Promise<GigPreview[]> => {
  try {
    const headers = askForMarkdown
      ? {
          Accept: "text/markdown",
        }
      : {};
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?from=${from.toISOString()}&to=${to.toISOString()}`,
      {
        headers: headers,
      },
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getMarkdownGigs = async (
  from: Date,
  to: Date,
): Promise<MarkdownGigs> => {
  try {
    const response = await api.get<MarkdownGigs>(
      `/gigs?from=${from.toISOString()}&to=${to.toISOString()}`,
      {
        headers: {
          Accept: "text/markdown",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGigByDateAndPlaceId = async (
  date: Date,
  placeId: string,
): Promise<GigMinimal | null> => {
  try {
    const response = await api.get<GigWithBandsAndPlace | undefined>(
      `/gigs?date=${date.toISOString()}&placeId=${placeId}`,
    );
    return response.data ?? null;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) return null;
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
    if (isAxiosError(error) && error.response?.status === 404) return null;
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
    if (isAxiosError(error) && error.response?.status === 404) return null;
    throw new Error(getErrorMessage(error));
  }
};

export type FromFormSimpleBand = Omit<
  BandPreview,
  "id" | "order" | "genres"
> & {
  id?: Band["id"] | undefined;
  genres: Genre["id"][];
  order?: number;
  key: string; // needed by the add gig form
};

export type FormCreateGigArgs = Omit<
  Gig,
  "id" | "createdAt" | "authorId" | "updatedAt" | "isCanceled" | "isSoldOut"
> & {
  id?: string;
  createdAt?: Date;
  bands: FromFormSimpleBand[];
  imageFile?: File | null;
};

export type CreateGigArgs = Omit<
  Gig,
  "id" | "createdAt" | "authorId" | "updatedAt" | "isCanceled" | "isSoldOut"
> & {
  id?: string;
  createdAt?: Date;
  // order has been populated when sending to the API
  bands: (Omit<FromFormSimpleBand, "order" | "key"> & { order: number })[];
  imageFile?: File | null;
};

export const createGig = async (
  gig: CreateGigArgs,
): Promise<GigWithBandsAndPlace> => {
  const formData = new FormData();
  const { imageFile, ...otherValues } = gig;
  if (imageFile) {
    formData.append("file", imageFile);
  }
  formData.append(
    "data",
    JSON.stringify({
      ...otherValues,
      date: gig.date.toISOString(), // serialize date to not lose timezone info
    }),
  );
  try {
    const response = await api.post<GigWithBandsAndPlace>(`/gigs`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type EditGigArgs = Gig & {
  bands: (Omit<Band, "id" | "genres"> & {
    id: BandWithGenres["id"];
    genres: Genre["id"][];
    order: number;
  })[];
  imageFile?: File | null;
};

export const editGig = async (
  gig: EditGigArgs,
): Promise<GigWithBandsAndPlace> => {
  const formData = new FormData();
  const { imageFile, ...otherValues } = gig;
  if (imageFile) {
    formData.append("file", imageFile);
  }
  formData.append(
    "data",
    JSON.stringify({
      ...otherValues,
      date: gig.date.toISOString(), // serialize date to not lose timezone info
    }),
  );
  try {
    const response = await api.put<GigWithBandsAndPlace>(
      `/gigs/${gig.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
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

export const getMissingDataGigs = async (): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs/missingData`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
