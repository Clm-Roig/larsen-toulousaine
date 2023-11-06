import { NextResponse } from "next/server";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({
    gigs: [
      {
        id: "1",
      },
      {
        id: "2",
      },
    ],
  });
}

export async function POST(request: Request) {
  const gigData = await request.json();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json(gigData);
}

export async function DELETE() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return NextResponse.json({});
}
