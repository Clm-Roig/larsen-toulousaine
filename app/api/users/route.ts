import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();
  // TODO: Prisma doesn't provide a type-safe and automatic way to exclude a field.
  // See this issue: https://github.com/prisma/prisma/issues/5042
  const usersWithoutPassword = users.map((u) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = u;
    return rest;
  });
  return NextResponse.json({
    users: usersWithoutPassword,
  });
}
