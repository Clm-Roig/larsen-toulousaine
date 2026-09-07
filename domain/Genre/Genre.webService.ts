import api, { getErrorMessage } from "@/lib/axios";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";

export const getGenres = async (): Promise<GenreWithBandCount[]> => {
  try {
    const response = await api.get<{ genres: GenreWithBandCount[] }>(`/genres`);
    return response.data.genres;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
