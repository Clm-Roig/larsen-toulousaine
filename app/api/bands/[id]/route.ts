import { authOptions } from "@/utils/authOptions";
import { EditBandArgs } from "@/domain/Band/Band.webService";
import { cantDeleteBandBecauseInGigError } from "@/domain/Band/errors";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  flattenBandGigs,
  validateCountryAndRegionCodes,
} from "@/app/api/utils/bands";
import { gigWithBandsAndGenresInclude } from "../../utils/gigs";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as EditBandArgs;
  if (!body) {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const {
    id,
    city,
    countryCode,
    genres,
    isATribute,
    isLocal,
    isSafe,
    name,
    regionCode,
  } = body;

  // Check country & region code
  const validationMsg = validateCountryAndRegionCodes(countryCode, regionCode);
  if (validationMsg) {
    return NextResponse.json(
      { message: `Bad request. ${validationMsg}` },
      { status: 400 },
    );
  }

  try {
    const updatedBand = await prisma.band.update({
      where: { id: id },
      data: Prisma.validator<Prisma.BandUpdateInput>()({
        city: city,
        countryCode: isLocal ? LOCAL_COUNTRY_CODE : countryCode,
        genres: {
          set: genres.map((gId) => ({ id: gId })),
        },
        isATribute: isATribute,
        isLocal: isLocal,
        isSafe: isSafe,
        name: name,
        regionCode: isLocal ? LOCAL_REGION_CODE : regionCode,
      }),
      include: { genres: true },
    });
    revalidatePath("/api/bands");
    return NextResponse.json(updatedBand);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update a band.",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    await prisma.band.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);

    // Trying to delete a band related to a gig
    if (
      error?.code === "P2003" &&
      error?.meta?.field_name === "BandsOnGigs_bandId_fkey (index)"
    ) {
      return toResponse(cantDeleteBandBecauseInGigError());
    }
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete a band.",
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const band = await prisma.band.findFirst({
    where: {
      id: id,
    },
    include: {
      genres: true,
      gigs: {
        include: {
          gig: {
            include: gigWithBandsAndGenresInclude,
          },
        },
      },
    },
  });
  if (!band) {
    return new Response(null, { status: 404 });
  }

  // @ts-ignore typing is too complex here...
  const flattenedBand = flattenBandGigs(band);

  return NextResponse.json(flattenedBand);
}
