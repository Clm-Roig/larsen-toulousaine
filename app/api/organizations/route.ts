import {
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
  unknownError,
} from "@/domain/errors";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { authOptions } from "@/utils/authOptions";
import { getPrismaOrderByFromRequest } from "@/app/api/utils/orderBy";
import { CreateOrganizationArgs } from "@/domain/Organization/Organization.webService";

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
  let body: CreateOrganizationArgs;
  try {
    body = (await request.json()) as CreateOrganizationArgs;
  } catch {
    return toResponse(missingBodyError);
  }

  const { user } = (await getServerSession(authOptions)) ?? {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authorId, ...organizationData } = body;
  try {
    const createdOrganization = await prisma.organization.create({
      data: Prisma.validator<Prisma.OrganizationCreateInput>()({
        ...organizationData,
        author: { connect: { id: user.id } },
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
