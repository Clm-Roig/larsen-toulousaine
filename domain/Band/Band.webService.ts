import api, { getErrorMessage } from "@/lib/axios";
import { BandWithGenres, BandWithGenresAndGigCount } from "./Band.type";
import { Genre } from "@prisma/client";

export const searchBandsByName = async (
  query: string | undefined,
): Promise<BandWithGenres[]> => {
  try {
    const response = await api.get<{ bands: BandWithGenres[] }>(
      `/bands/search${query ? `?query=${encodeURIComponent(query)}` : ""}`,
    );
    return response.data.bands;
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

export type EditBandArgs = Omit<BandWithGenres, "genres" | "createdAt"> & {
  genres: Array<Genre["id"]>;
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
