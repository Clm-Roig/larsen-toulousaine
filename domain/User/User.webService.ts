import { User } from "@prisma/client";
import prisma from "../../lib/prisma";

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};
