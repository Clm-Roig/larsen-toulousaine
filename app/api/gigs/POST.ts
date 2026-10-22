import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { removeParametersFromUrl } from "@/utils/utils";
import {
  downloadImage,
  GIG_POSTERS_FOLDER_NAME,
  storeImage,
} from "@/app/api/utils/image";
import { computeGigSlug } from "@/domain/Gig/Gig.service";
import { IMG_OUTPUT_FORMAT } from "@/domain/Gig/constants";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/apiErrors";
import { CreateGigArgs } from "@/domain/Gig/Gig.webService";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import {
  invalidImageUrlError,
  tooBigImageFileError,
  tooBigImageUrlError,
} from "@/domain/Gig/apiErrors";
import dayjs from "@/lib/dayjs";

import { MAX_IMAGE_SIZE } from "@/domain/image";
import { File } from "buffer";
import {
  LOCAL_COUNTRY_CODE,
  LOCAL_REGION_CODE,
} from "@/domain/Place/constants";

async function POST(request: NextRequest) {
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  // Parse formData
  const formData = await request.formData();
  const rawData: { data: unknown } = { data: null };
  formData.forEach((value, key) => (rawData[key] = value));
  let body: CreateGigArgs;
  try {
    body = JSON.parse(rawData.data as string) as CreateGigArgs;
  } catch {
    return toResponse(missingBodyError);
  }
  const imageFile = formData.get("file");
  const isImageFileAFile = imageFile instanceof File;
  if (isImageFileAFile && imageFile.size > MAX_IMAGE_SIZE) {
    return toResponse(tooBigImageFileError);
  }

  const { bands, imageUrl } = body;
  try {
    // Create inexisting bands
    const toCreateBands = bands.filter((b) => !b.id);
    const createdBands = await Promise.all(
      toCreateBands.map(async (band) => {
        const { genres, isADJ, isATribute, isLocal, isSafe, name, order } =
          band;

        const createdBand = await prisma.band.create({
          data: {
            countryCode: isLocal ? LOCAL_COUNTRY_CODE : undefined,
            genres: { connect: genres.map((g) => ({ id: g })) },
            isADJ: isADJ,
            isATribute: isATribute,
            isLocal: isLocal,
            isSafe: isSafe,
            name: name,
            regionCode: isLocal ? LOCAL_REGION_CODE : undefined,
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

    const arrayBufferImg =
      imageFile && isImageFileAFile
        ? await imageFile.arrayBuffer() // use imageFile in priority
        : imageUrl
          ? await downloadImage(imageUrl) // else use imageUrl
          : undefined;

    if (arrayBufferImg) {
      blobImageUrl = await storeImage({
        arrayBufferImg,
        filename: slug,
        folderName: GIG_POSTERS_FOLDER_NAME,
        imageFormat: IMG_OUTPUT_FORMAT,
      });
    }

    const { placeId, sourceUrl, organizationId, ...bodyRest } = body;
    const createdGig = await prisma.gig.create({
      data: Prisma.validator<Prisma.GigCreateInput>()({
        ...bodyRest,
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
        sourceUrl: sourceUrl ? removeParametersFromUrl(sourceUrl) : null,
        imageUrl: blobImageUrl,
        isAcceptingBankCard: body.isAcceptingBankCard ?? null,
        organization: organizationId
          ? { connect: { id: organizationId } }
          : undefined,
        place: { connect: { id: placeId } },
        slug: slug,
        ticketReservationLink: body.hasTicketReservationLink
          ? body.ticketReservationLink
          : null,
      }),
      include: { bands: true },
    });
    return NextResponse.json(createdGig);
  } catch (error) {
    // console.error(error);
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
    if (error instanceof Error) {
      // TODO: Improve custom error management
      if (error.message === invalidImageUrlError.name) {
        return toResponse(invalidImageUrlError);
      }
      if (error.message === tooBigImageUrlError.name) {
        return toResponse(tooBigImageUrlError);
      }
    }
    return toResponse(unknownError);
  }
}

export default POST;
