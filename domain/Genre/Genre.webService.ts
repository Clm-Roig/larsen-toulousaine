import api, { getErrorMessage } from "@/lib/axios";
import { GenreWithBandCount } from "@/domain/Genre/Genre.type";

export type CreateGenreArgs = Omit<GenreWithBandCount, "id" | "count"> & {
  id?: string;
};

export type EditGenreArgs = Pick<GenreWithBandCount, "id" | "name" | "color">;

export const getGenres = async (): Promise<GenreWithBandCount[]> => {
  try {
    const response = await api.get<{ genres: GenreWithBandCount[] }>(`/genres`);
    return response.data.genres;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const editGenre = async (
  genre: EditGenreArgs,
): Promise<GenreWithBandCount> => {
  try {
    const response = await api.put<GenreWithBandCount>(
      `/genres/${genre.id}`,
      genre,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteGenre = async (genreId: string): Promise<void> => {
  try {
    await api.delete(`/genres/${genreId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createGenre = async (
  genre: CreateGenreArgs,
): Promise<GenreWithBandCount> => {
  try {
    const response = await api.post<GenreWithBandCount>(`/genres`, {
      ...genre,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
