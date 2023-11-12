import { Role } from "@prisma/client";

export const getRoleLabel = (role: Role): string => {
  let roleLabel: string;
  switch (role) {
    case Role.ADMIN:
      roleLabel = "Administrateur";
      break;
    case Role.MODERATOR:
      roleLabel = "Modérateur";
      break;
    default:
      throw new Error(`Unknown role: ${role as string}`);
  }
  return roleLabel;
};
