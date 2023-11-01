import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(/* request: Request */) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, pseudo } = json;
    if (!email) {
      throw new Error("You must provide an email.");
    }
    if (!pseudo) {
      throw new Error("You must provide a pseudo.");
    }
    const user = await prisma.user.create({
      data: {
        pseudo: pseudo as string,
        email: email as string,
      },
    });

    return new NextResponse(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error?.code === "P2002") {
      return new NextResponse("User with email already exists", {
        status: 409,
      });
    }
    return new NextResponse(error.message, { status: 500 });
  }
}
