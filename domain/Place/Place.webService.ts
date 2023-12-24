import api, { getErrorMessage } from "@/lib/axios";
import { Place } from "@prisma/client";
import { PlaceWithGigCount } from "./Place.type";

export type EditPlaceArgs = Pick<Place, "id" | "name">;

export const getPlaces = async (): Promise<PlaceWithGigCount[]> => {
  try {
    const response = await api.get<{ places: PlaceWithGigCount[] }>(`/places`);
    return response.data.places;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const editPlace = async (place: EditPlaceArgs): Promise<Place> => {
  try {
    const response = await api.put<Place>(`/places/${place.id}`, place);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deletePlace = async (placeId: string): Promise<void> => {
  try {
    await api.delete<void>(`/places/${placeId}`);
  } catch (error) {
    if (error?.response?.data?.frMessage) {
      throw new Error(error?.response?.data?.frMessage);
    }
    throw new Error(getErrorMessage(error));
  }
};
