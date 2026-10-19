import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { pseudo: "asc" }],
    include: {
      _count: {
        select: { gigs: true },
      },
    },
  });
  // TODO: Prisma doesn't provide a type-safe and automatic way to exclude a field.
  // See this issue: https://github.com/prisma/prisma/issues/5042
  const usersWithoutPassword = users.map((u) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = u;
    return rest;
  });
  return NextResponse.json({
    /* Sort rule:
      - Admin first
      - Moderators (by alphabetical order)
      - Previously moderators
    */
    users: usersWithoutPassword.sort((u1, u2) =>
      u1.role === Role.ADMIN
        ? -1
        : u1.role === Role.PREVIOUSLY_MODERATOR
          ? 1
          : u1.pseudo.localeCompare(u2.pseudo),
    ),
  });
}
