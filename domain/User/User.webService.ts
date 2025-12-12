import { UserWithGigCount } from "@/domain/User/User.type";
import api, { getErrorMessage } from "@/lib/axios";

export const getUsers = async (): Promise<UserWithGigCount[]> => {
  try {
    const response = await api.get<{ users: UserWithGigCount[] }>(`/users`);
    return response.data.users;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error));
  }
};

export interface UpdatePasswordValues {
  newPassword: string;
  newPasswordConfirmation: string;
  previousPassword: string;
}

export const updatePassword = async (
  values: UpdatePasswordValues,
): Promise<void> => {
  try {
    await api.put(`/users/password`, {
      newPassword: values.newPassword,
      previousPassword: values.previousPassword,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
