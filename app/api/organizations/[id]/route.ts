import { authOptions } from "@/utils/authOptions";
import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { Organization, Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  let body: Organization;
  try {
    body = (await request.json()) as Organization;
  } catch {
    return toResponse(missingBodyError);
  }
  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  const { id, isActive, logoUrl, name } = body;
  try {
    const updatedOrganization = await prisma.organization.update({
      where: { id: id },
      data: Prisma.validator<Prisma.OrganizationUpdateInput>()({
        isActive: isActive,
        logoUrl: logoUrl,
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
