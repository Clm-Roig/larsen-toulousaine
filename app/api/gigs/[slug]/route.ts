import { GetServerSidePropsContext } from "next";
import { NextResponse } from "next/server";

export async function GET(context: GetServerSidePropsContext) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { params } = context;
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
