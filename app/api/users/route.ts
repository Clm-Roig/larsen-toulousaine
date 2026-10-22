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
    omit: {
      password: true,
    },
  });
  return NextResponse.json({
    /* Sort rule:
      - Admin first
      - Moderators (by alphabetical order)
      - Previously moderators
    */
    users: users.sort((u1, u2) =>
      u1.role === Role.ADMIN
        ? -1
        : u1.role === Role.PREVIOUSLY_MODERATOR
          ? 1
          : u1.pseudo.localeCompare(u2.pseudo),
    ),
  });
}
