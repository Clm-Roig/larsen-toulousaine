import { gigListOrderBy, completeGigInclude } from "@/app/api/utils/gigs";
import { toResponse, unknownError } from "@/domain/errors";
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
      take: 1,
      skip: 1,
      cursor: {
        slug: slug,
      },
      orderBy: gigListOrderBy,
      include: completeGigInclude,
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
    return toResponse(unknownError);
  }
}
