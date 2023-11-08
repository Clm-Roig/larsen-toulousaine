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

// TODO: add typing
export const updatePassword = async (values: any): Promise<void> => {
  try {
    await api.put<void>(`/users/password`, values);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
