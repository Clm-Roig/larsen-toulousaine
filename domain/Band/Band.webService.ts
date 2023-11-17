import api, { getErrorMessage } from "@/lib/axios";
import { BandWithGenres } from "./Band.type";
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

export const getBands = async (): Promise<BandWithGenres[]> => {
  try {
    const response = await api.get<{ bands: BandWithGenres[] }>(`/bands`);
    return response.data.bands;
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
