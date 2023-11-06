import api, { getErrorMessage } from "@/lib/axios";
import { Place } from "@prisma/client";

export const getPlaces = async (): Promise<Place[]> => {
  try {
    const response = await api.get<{ places: Place[] }>(`/places`);
    return response.data.places;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
