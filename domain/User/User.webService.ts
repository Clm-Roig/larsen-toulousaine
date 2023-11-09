import { ERROR_NAMES, updatePasswordErrors } from "@/domain/User/errors";
import api, { getErrorMessage } from "@/lib/axios";
import { User } from "@prisma/client";

const getError = (errorName: ERROR_NAMES) => {
  const error = updatePasswordErrors.find((e) => e.name === errorName);
  return error;
};

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
    if (error?.response?.data?.name) {
      const errorName = error?.response?.data?.name;
      if (Object.values(ERROR_NAMES).includes(errorName)) {
        throw new Error(getError(errorName as ERROR_NAMES)?.frMessage);
      }
    }
    throw new Error(getErrorMessage(error));
  }
};
