import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { removeParametersFromUrl } from "@/utils/utils";
import { downloadImage, storeImage } from "@/app/api/utils/image";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { IMG_OUTPUT_FORMAT } from "@/domain/Gig/constants";
import {
  CustomError,
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";
import { CreateGigArgs } from "@/domain/Gig/Gig.webService";
import { revalidatePath } from "next/cache";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import {
  invalidImageUrlError,
  tooBigImageFileError,
} from "@/domain/Gig/errors";
import dayjs from "@/lib/dayjs";

import { MAX_IMAGE_SIZE } from "@/domain/image";
import { File } from "buffer";

async function POST(request: NextRequest) {
  // Check auth
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  // Parse formData
  const formData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawData: { data: any } = { data: null };
  formData.forEach((value, key) => (rawData[key] = value));
  const body: CreateGigArgs = JSON.parse(rawData.data);

  // Check body and file
  if (!body) {
    return toResponse(missingBodyError);
  }
  const imageFile = formData.get("file") as unknown as File;
  if (imageFile && imageFile?.size > MAX_IMAGE_SIZE) {
    return toResponse(tooBigImageFileError);
  }

  const { bands, imageUrl } = body;
  try {
    // Create inexisting bands
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const { genres, isATribute, isLocal, isSafe, name, order } = band;

        const createdBand = await prisma.band.create({
          data: {
            genres: { connect: genres.map((g) => ({ id: g })) },
            isATribute: isATribute,
            isLocal: isLocal,
            isSafe: isSafe,
            name: name,
          },
        });
        return { ...createdBand, order: order };
      }),
    );
    const toConnectBands = bands.filter((b) => b.id);
    const slug = computeGigSlug({
      bands: bands,
      date: body.date,
      name: body.name,
    });

    let blobImageUrl: string | undefined = undefined;
    if (imageUrl || imageFile) {
      const arrayBufferImg = imageUrl
        ? await downloadImage(imageUrl)
        : await imageFile.arrayBuffer();
      blobImageUrl = await storeImage({
        arrayBufferImg,
        filename: slug,
        imageFormat: IMG_OUTPUT_FORMAT,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { placeId, facebookEventUrl, ...bodyWithoutPlaceId } = body;
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...bodyWithoutPlaceId,
        author: { connect: { id: user.id } },
        bands: {
          create: [...toConnectBands, ...createdBands].map((band) => ({
            band: {
              connect: {
                id: band.id,
              },
            },
            order: band.order,
          })),
        },
        // endDate must be different than date
        endDate: dayjs(body.endDate).isSame(dayjs(body.date))
          ? null
          : body.endDate,
        facebookEventUrl: facebookEventUrl
          ? removeParametersFromUrl(facebookEventUrl)
          : null,
        imageUrl: blobImageUrl,
        isAcceptingBankCard: body.isAcceptingBankCard
          ? body.isAcceptingBankCard
          : null,
        place: { connect: { id: body.placeId } },
        slug: slug,
        ticketReservationLink: body.hasTicketReservationLink
          ? body.ticketReservationLink
          : null,
      }),
      include: { bands: true },
    });
    if (createdBands?.length > 0) {
      revalidatePath("bands");
    }
    return NextResponse.json(createdGig);
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message: "There is a conflict with another gig.",
            frMessage: "Il y a un conflit avec un autre concert.",
          },
          { status: 409 },
        );
      }
    }
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message: `There was an error with your data when trying to create a gig: ${error.message}`,
        },
        { status: 400 },
      );
    }
    if (error.name && error.name === invalidImageUrlError.name) {
      return toResponse(error as CustomError);
    }
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}

export default POST;
