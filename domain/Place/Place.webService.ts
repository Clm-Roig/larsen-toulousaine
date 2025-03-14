import api, { getErrorMessage } from "@/lib/axios";
import { Place } from "@prisma/client";
import { PlaceWithGigCount } from "./Place.type";

export type CreatePlaceArgs = Omit<Place, "id"> & {
  id?: string;
};

export type EditPlaceArgs = Pick<
  Place,
  | "id"
  | "address"
  | "city"
  | "isClosed"
  | "isSafe"
  | "name"
  | "size"
  | "website"
>;
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
    throw new Error(getErrorMessage(error));
  }
};

export const createPlace = async (place: CreatePlaceArgs): Promise<Place> => {
  try {
    const response = await api.post<Place>(`/places`, {
      ...place,
      // sometimes, latitude or longitude can be a string. This is due to the NumberInput component from Mantine
      latitude: place.latitude && Number(place.latitude),
      longitude: place.longitude && Number(place.longitude),
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
