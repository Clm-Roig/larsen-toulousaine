import prisma from "../../lib/prisma";
import { User } from "./User.type";

export const getUsers = async (): Promise<User[]> => {
  const users = await prisma.user.findMany();
  return users;
};
