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
