// Hack for deploying on Netlify where we can't use prisma client when building.
// So we duplicate the Role enum here.

export const Role = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  PREVIOUSLY_MODERATOR: "PREVIOUSLY_MODERATOR",
  USER: "USER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
