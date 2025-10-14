import { Role } from "@prisma/client";

export enum Permission {
  EDIT_BAND,
}

export const permissions = {
  [Role.ADMIN]: [Permission.EDIT_BAND],
  [Role.MODERATOR]: [Permission.EDIT_BAND],
  [Role.PREVIOUSLY_MODERATOR]: [],
};
