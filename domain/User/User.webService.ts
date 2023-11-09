import api, { getErrorMessage } from "@/lib/axios";
import { User } from "@prisma/client";

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<{ users: User[] }>(`/users`);
    return response.data.users;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export type UpdatePasswordValues = {
  newPassword: string;
  newPasswordConfirmation: string;
  previousPassword: string;
};

export const updatePassword = async (
  values: UpdatePasswordValues,
): Promise<void> => {
  try {
    await api.put(`/users/password`, {
      newPassword: values.newPassword,
      previousPassword: values.previousPassword,
    });
  } catch (error) {
    if (error?.response?.data?.frMessage) {
      throw new Error(error?.response?.data?.frMessage);
    }
    throw new Error(getErrorMessage(error));
  }
};
