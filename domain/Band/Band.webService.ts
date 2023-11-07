import api, { getErrorMessage } from "@/lib/axios";
import { BandWithGenres } from "./Band.type";

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
