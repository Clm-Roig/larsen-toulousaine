import { Role } from "@prisma/client";

export const getRoleLabel = (role: Role): string => {
  let roleLabel: string;
  switch (role) {
    case Role.ADMIN:
      roleLabel = "Administrateur·ice";
      break;
    case Role.MODERATOR:
      roleLabel = "Modérateur·ice";
      break;
    case Role.PREVIOUSLY_MODERATOR:
      roleLabel = "Ancien·ne Modérateur·ice";
      break;
    default:
      throw new Error(`Unknown role: ${role as string}`);
  }
  return roleLabel;
};
