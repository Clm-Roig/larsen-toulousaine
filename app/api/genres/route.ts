import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({
    users: users,
  });
}
