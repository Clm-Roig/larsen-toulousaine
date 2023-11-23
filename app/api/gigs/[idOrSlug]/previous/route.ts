import {
  flattenGigBands,
  gigListOrderBy,
  gigWithBandsAndGenresInclude,
} from "@/app/api/utils/gigs";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { idOrSlug: string } },
) {
  const { idOrSlug: rawIdOrSlug } = params;
  const idOrSlug = decodeURIComponent(rawIdOrSlug);
  try {
    const gig = await prisma.gig.findFirst({
      take: -1,
      skip: 1,
      cursor: {
        slug: idOrSlug,
      },
      orderBy: gigListOrderBy,
      include: gigWithBandsAndGenresInclude,
    });
    if (!gig) {
      return new Response(null, { status: 404 });
    }
    const flattenedGig = flattenGigBands(gig);
    return NextResponse.json(flattenedGig);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to get the next gig.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}
