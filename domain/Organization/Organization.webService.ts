import api, { getErrorMessage } from "@/lib/axios";
import { Organization } from "@prisma/client";

export type CreateOrganizationArgs = Omit<Organization, "id"> & {
  id?: string;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await api.get<{ organizations: Organization[] }>(
      `/organizations`,
    );
    return response.data.organizations;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const editOrganization = async (
  organization: Organization,
): Promise<Organization> => {
  try {
    const response = await api.put<Organization>(
      `/organizations/${organization.id}`,
      organization,
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const deleteOrganization = async (
  organizationId: string,
): Promise<void> => {
  try {
    await api.delete(`/organizations/${organizationId}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createOrganization = async (
  organization: CreateOrganizationArgs,
): Promise<Organization> => {
  try {
    const response = await api.post<Organization>(`/organizations`, {
      ...organization,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
