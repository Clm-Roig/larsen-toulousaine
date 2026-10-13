import { OrganizationWithGigCount } from "@/domain/Organization/Organization.type";
import api, { getErrorMessage } from "@/lib/axios";
import { Boolean3ChoicesFormValue } from "@/utils/utils";
import { Organization } from "@prisma/client";

export type CreateOrganizationArgs = Omit<
  Organization,
  "id" | "createdAt" | "updatedAt" | "author" | "authorId"
> & {
  id?: string;
  logoFile?: File | null;
};

export type FormCreateOrganizationArgs = Omit<
  Organization,
  "id" | "createdAt" | "authorId" | "updatedAt"
> & {
  id?: string;
  logoFile?: File | null;
};

export const searchOrganizations = async (
  name: string | undefined,
  isActive: Boolean3ChoicesFormValue,
  page?: number,
): Promise<{ organizations: OrganizationWithGigCount[]; count: number }> => {
  const nameParam = name ? `name=${encodeURIComponent(name)}` : null;
  const isActiveParam = isActive !== "" ? `isActive=${isActive}` : null;
  const pageParam = page ? `page=${page}` : null;
  const params = [nameParam, isActiveParam, pageParam]
    .filter((p): p is string => !!p)
    .join("&");
  try {
    const response = await api.get<{
      organizations: OrganizationWithGigCount[];
      count: number;
    }>(`/organizations/search?${params}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getOrganizations = async (): Promise<
  OrganizationWithGigCount[]
> => {
  try {
    const response = await api.get<{
      organizations: OrganizationWithGigCount[];
    }>("/organizations");
    return response.data.organizations;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type EditOrganizationArgs = Omit<
  Organization,
  "createdAt" | "updatedAt"
> & {
  logoFile: File | null;
};

export const editOrganization = async (
  organization: EditOrganizationArgs,
): Promise<OrganizationWithGigCount> => {
  const formData = new FormData();
  const { logoFile, ...otherValues } = organization;
  if (logoFile) {
    formData.append("file", logoFile);
  }
  formData.append(
    "data",
    JSON.stringify({
      ...otherValues,
    }),
  );
  try {
    const response = await api.put<OrganizationWithGigCount>(
      `/organizations/${organization.id}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
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
  const formData = new FormData();
  const { logoFile, ...otherValues } = organization;
  if (logoFile) {
    formData.append("file", logoFile);
  }
  formData.append(
    "data",
    JSON.stringify({
      ...otherValues,
    }),
  );

  try {
    const response = await api.post<Organization>(`/organizations`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
