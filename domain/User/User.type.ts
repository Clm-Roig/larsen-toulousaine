import { Role } from "@prisma/client";

export type User = {
  id?: string;
  pseudo: string;
  email: string;
  role: Role;
};
