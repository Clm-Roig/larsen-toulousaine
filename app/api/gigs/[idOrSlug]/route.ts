import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  const { idOrSlug: rawIdOrSlug } = params;
  const idOrSlug = decodeURIComponent(rawIdOrSlug);
  const gig = await prisma.gig.findFirst({
    where: {
      OR: [
        {
          id: {
            equals: idOrSlug,
          },
        },
        {
          slug: {
            equals: idOrSlug,
          },
        },
      ],
    },
    include: {
      author: true,
      place: true,
      bands: {
        include: {
          genres: true,
        },
      },
    },
  });
  return NextResponse.json(gig);
}
