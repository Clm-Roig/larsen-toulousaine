import { Role } from "@prisma/client";

export enum Permission {
  CREATE_GIG,
  EDIT_BAND,
  EDIT_GIG,
  SEE_UNSAFE_PLACES,
  SEE_USERS,
  SEE_WEEKLY_GIGS_MARKDOWN,
}

export const permissions = {
  [Role.ADMIN]: [
    Permission.CREATE_GIG,
    Permission.EDIT_BAND,
    Permission.EDIT_GIG,
    Permission.SEE_UNSAFE_PLACES,
    Permission.SEE_USERS,
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  ],
  [Role.MODERATOR]: [
    Permission.CREATE_GIG,
    Permission.EDIT_BAND,
    Permission.EDIT_GIG,
    Permission.SEE_UNSAFE_PLACES,
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  ],
  [Role.PREVIOUSLY_MODERATOR]: [],
};
