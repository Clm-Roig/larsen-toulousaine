import { GigWithAuthor, GigWithBandsAndPlace } from "./Gig.type";
import api, { getErrorMessage } from "@/lib/axios";

export const getGigs = async (
  from: Date,
  to: Date,
): Promise<GigWithBandsAndPlace[]> => {
  try {
    const response = await api.get<{ gigs: GigWithBandsAndPlace[] }>(
      `/gigs?from=${from.toString()}&to=${to.toString()}`,
    );
    return response.data.gigs;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getGig = async (
  idOrSlug: string,
): Promise<(GigWithBandsAndPlace & GigWithAuthor) | null> => {
  try {
    const response = await api.get<
      (GigWithBandsAndPlace & GigWithAuthor) | undefined
    >(`/gigs/${encodeURIComponent(idOrSlug)}`);
    return response.data ?? null;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createGig = async (
  // TODO: improve typing here
  gig: unknown,
): Promise<GigWithBandsAndPlace> => {
  try {
    const response = await api.post<GigWithBandsAndPlace>(`/gigs`, gig);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
