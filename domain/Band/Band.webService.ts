import api, { getErrorMessage } from "@/lib/axios";
import {
  BandWithGenres,
  BandWithGenresAndGigCount,
  BandWithGenresAndGigs,
} from "./Band.type";
import { Genre } from "@prisma/client";

export const searchBands = async (
  name: string | undefined,
  genres?: Genre["id"][],
  page?: number,
): Promise<{ bands: BandWithGenresAndGigCount[]; count: number }> => {
  const nameParam = name ? `name=${encodeURIComponent(name)}` : null;
  const genresParam = genres
    ? `genres=${encodeURIComponent(genres?.join(","))}`
    : null;
  const pageParam = page ? `page=${page}` : null;
  const params = [nameParam, genresParam, pageParam]
    .filter((p) => !!p)
    .join("&");
  try {
    const response = await api.get<{
      bands: BandWithGenresAndGigCount[];
      count: number;
    }>(`/bands/search?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBands = async (
  page: number,
): Promise<{ bands: BandWithGenresAndGigCount[]; count: number }> => {
  try {
    const response = await api.get<{
      bands: BandWithGenresAndGigCount[];
      count: number;
    }>(`/bands?page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getBand = async (
  bandId: string,
): Promise<BandWithGenresAndGigs | null> => {
  try {
    const response = await api.get<BandWithGenresAndGigs | undefined>(
      `/bands/${encodeURIComponent(bandId)}`,
    );
    return response.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type EditBandArgs = Omit<
  BandWithGenres,
  "genres" | "createdAt" | "updatedAt"
> & {
  genres: Genre["id"][];
};

export const editBand = async (band: EditBandArgs): Promise<BandWithGenres> => {
  try {
    const response = await api.put<BandWithGenres>(`/bands/${band.id}`, band);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteBand = async (bandId: string): Promise<void> => {
  try {
    await api.delete<void>(`/bands/${bandId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
