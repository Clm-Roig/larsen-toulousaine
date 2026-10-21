import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/apiErrors";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { authOptions } from "@/utils/authOptions";
import { getPrismaOrderByFromRequest } from "@/app/api/utils/orderBy";
import { CreateOrganizationArgs } from "@/domain/Organization/Organization.webService";
import { MAX_IMAGE_SIZE } from "@/domain/image";
import { tooBigImageFileError } from "@/domain/Gig/apiErrors";
import {
  downloadImage,
  ORGANIZATION_LOGOS_FOLDER_NAME,
  storeImage,
} from "@/app/api/utils/image";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const sortBy = searchParams.getAll("sortBy");
  const order = searchParams.getAll("order") as Prisma.SortOrder[];

  const orderBy = getPrismaOrderByFromRequest({
    validFields: ["name", "gigs._count"],
    order: order,
    sortBy: sortBy,
    defaultSort: { name: "asc" },
  });
  const organizations = await prisma.organization.findMany({
    orderBy: orderBy,
    include: {
      _count: {
        select: { gigs: true },
      },
    },
  });
  return NextResponse.json({
    organizations,
  });
}

export async function POST(request: NextRequest) {
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  // Parse formData
  const formData = await request.formData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawData: { data: any } = { data: null };
  formData.forEach((value, key) => (rawData[key] = value));
  let body: CreateOrganizationArgs;
  try {
    body = JSON.parse(rawData.data as string) as CreateOrganizationArgs;
  } catch {
    return toResponse(missingBodyError);
  }

  const { isActive, link, logoUrl, name } = body;
  const logoFile = formData.get("file");
  const isLogoFileAFile = logoFile instanceof File;
  if (isLogoFileAFile && logoFile.size > MAX_IMAGE_SIZE) {
    return toResponse(tooBigImageFileError);
  }

  try {
    let blobImageUrl: string | undefined = undefined;

    const arrayBufferImg =
      logoFile && isLogoFileAFile
        ? await logoFile.arrayBuffer() // use logoFile in priority
        : logoUrl
          ? await downloadImage(logoUrl) // else use logoUrl
          : undefined;

    if (arrayBufferImg) {
      blobImageUrl = await storeImage({
        arrayBufferImg,
        filename: name,
        folderName: ORGANIZATION_LOGOS_FOLDER_NAME,
        imageFormat: "png",
        resizeOptions: {},
      });
    }
    const createdOrganization = await prisma.organization.create({
      data: Prisma.validator<Prisma.OrganizationCreateInput>()({
        author: { connect: { id: user.id } },
        isActive: isActive,
        link: link,
        logoUrl: blobImageUrl,
        name: name,
      }),
      include: {
        _count: {
          select: { gigs: true },
        },
      },
    });
    return NextResponse.json(createdOrganization);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to create an organization.",
        },
        { status: 400 },
      );
    }
    return toResponse(unknownError);
  }
}
