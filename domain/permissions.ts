import { Role } from "@prisma/client";

export enum Permission {
  CREATE_GIG,
  EDIT_BAND,
  EDIT_GIG,
  EDIT_ORGANIZATION,
  SEE_UNSAFE_GIGS,
  SEE_USERS,
  SEE_WEEKLY_GIGS_MARKDOWN,
}

export const permissions = {
  [Role.ADMIN]: [
    Permission.CREATE_GIG,
    Permission.EDIT_BAND,
    Permission.EDIT_GIG,
    Permission.EDIT_ORGANIZATION,
    Permission.SEE_UNSAFE_GIGS,
    Permission.SEE_USERS,
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  ],
  [Role.MODERATOR]: [
    Permission.CREATE_GIG,
    Permission.EDIT_BAND,
    Permission.EDIT_GIG,
    Permission.EDIT_ORGANIZATION,
    Permission.SEE_UNSAFE_GIGS,
    Permission.SEE_WEEKLY_GIGS_MARKDOWN,
  ],
  [Role.PREVIOUSLY_MODERATOR]: [],
};
