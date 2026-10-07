import { NB_OF_ORGANIZATIONS_PER_PAGE } from "@/domain/Organization/constants";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param request
 *  - name      {string}
 *  - isActive  {boolean}
 */
export async function GET(request: NextRequest) {
  const {
    nextUrl: { searchParams },
  } = request;
  const rawSearchedName = searchParams.get("name");
  const rawIsActive = searchParams.get("isActive");
  const isActive = rawIsActive
    ? rawIsActive === "true"
      ? true
      : rawIsActive === "false"
        ? false
        : null
    : null;
  const page = searchParams.get("page");
  const searchedName = rawSearchedName
    ? decodeURIComponent(rawSearchedName)
    : undefined;

  const whereClause: Prisma.OrganizationWhereInput = {
    name: {
      contains: searchedName,
      mode: "insensitive",
    },
    ...(isActive !== null ? { isActive } : {}),
  };
  const [count, organizations] = await prisma.$transaction([
    prisma.organization.count({
      where: whereClause,
    }),
    prisma.organization.findMany({
      orderBy: {
        name: "asc",
      },
      skip:
        (page !== null ? parseInt(page, 10) : 0) * NB_OF_ORGANIZATIONS_PER_PAGE,
      take: NB_OF_ORGANIZATIONS_PER_PAGE,
      where: whereClause,
      include: {
        _count: {
          select: { gigs: true },
        },
      },
    }),
  ]);

  return NextResponse.json({
    organizations: organizations,
    count: count,
  });
}
