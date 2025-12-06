import {
  gigListOrderBy,
  gigWithBandsAndGenresInclude,
} from "@/app/api/utils/gigs";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  try {
    const gig = await prisma.gig.findFirst({
      take: -1,
      skip: 1,
      cursor: {
        slug: slug,
      },
      orderBy: gigListOrderBy,
      include: gigWithBandsAndGenresInclude,
    });
    if (!gig) {
      return new Response(null, { status: 404 });
    }
    return NextResponse.json(gig.slug);
  } catch (error) {
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
