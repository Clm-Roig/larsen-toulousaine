import { authOptions } from "@/utils/authOptions";
import {
  formDataParsingError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { EditOrganizationArgs } from "@/domain/Organization/Organization.webService";
import { MAX_IMAGE_SIZE } from "@/domain/image";
import { tooBigImageFileError } from "@/domain/Gig/errors";
import {
  deleteImageOnCloudinary,
  downloadImage,
  ORGANIZATION_LOGOS_FOLDER_NAME,
  storeImage,
} from "@/app/api/utils/image";

export async function PUT(request: NextRequest) {
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  // Parse formData
  const rawData: Record<string, string> = {};
  const formData = await request.formData();
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      rawData[key] = value;
    }
  });
  let body: EditOrganizationArgs;
  try {
    body = JSON.parse(rawData.data) as EditOrganizationArgs;
  } catch {
    return toResponse(formDataParsingError);
  }

  // Check file
  const logoFile = formData.get("file");
  const isLogoFileAFile = logoFile instanceof File;
  if (isLogoFileAFile && logoFile.size > MAX_IMAGE_SIZE) {
    return toResponse(tooBigImageFileError);
  }

  const { id, isActive, link, logoUrl, name } = body;
  try {
    const previousOrganization = await prisma.organization.findUnique({
      where: { id: id },
    });
    const prevLogoUrl = previousOrganization?.logoUrl;
    let newLogoUrl: string | null =
      !logoFile && !logoUrl ? null : (prevLogoUrl ?? null);
    const hasImageChanged = !!logoFile || (logoUrl && logoUrl !== prevLogoUrl); // if an imageLogo is sent, it's to change it
    if (hasImageChanged) {
      const arrayBufferImg =
        logoFile && isLogoFileAFile
          ? await logoFile.arrayBuffer() // use logoFile in priority
          : logoUrl
            ? await downloadImage(logoUrl) // else use logoUrl
            : undefined;

      if (arrayBufferImg) {
        newLogoUrl = await storeImage({
          arrayBufferImg,
          filename: name,
          folderName: ORGANIZATION_LOGOS_FOLDER_NAME,
          imageFormat: "png",
          resizeOptions: {},
        });
      }
    }
    if (!newLogoUrl && prevLogoUrl) {
      await deleteImageOnCloudinary(
        prevLogoUrl,
        ORGANIZATION_LOGOS_FOLDER_NAME,
      );
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: id },
      data: Prisma.validator<Prisma.OrganizationUpdateInput>()({
        isActive: isActive,
        link: link,
        logoUrl: newLogoUrl,
        name: name,
      }),
    });

    return NextResponse.json(updatedOrganization);
  } catch (error) {
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update an organization.",
        },
        { status: 400 },
      );
    }
    return toResponse(unknownError);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  try {
    await prisma.organization.delete({
      where: {
        id: id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);

    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to delete an organization.",
        },
        { status: 400 },
      );
    }
    return toResponse(unknownError);
  }
}
