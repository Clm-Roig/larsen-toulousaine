import { Genre } from "@prisma/client";
import api, { getErrorMessage } from "@/lib/axios";

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await api.get<{ genres: Genre[] }>(`/genres`);
    return response.data.genres;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
