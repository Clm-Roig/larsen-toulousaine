import { Role } from "@/lib/Role"; // ugly hack, see lib/Role.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeJwt } from "@/lib/jwt";

const isAdminRouteFn = (pathname: string, req: NextRequest): boolean => {
  const conditions = [
    pathname.startsWith("/api/users") &&
      ["POST", "DELETE"].includes(req.method),
  ];
  return conditions.includes(true);
};

const isModeratorRouteFn = (pathname: string, req: NextRequest): boolean => {
  const conditions = [
    pathname.startsWith("/api/users") && ["PUT", "PATCH"].includes(req.method),
    pathname.startsWith("/api/gigs") &&
      ["POST", "DELETE", "PUT", "PATCH"].includes(req.method),
    pathname.startsWith("/api/gigs/missingData") &&
      ["GET"].includes(req.method),
    pathname.startsWith("/api/bands") &&
      ["POST", "DELETE", "PUT", "PATCH"].includes(req.method),
    pathname.startsWith("/api/places") &&
      ["POST", "DELETE", "PUT", "PATCH"].includes(req.method),
  ];
  return conditions.includes(true);
};

export async function proxy(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const { pathname } = req.nextUrl;

  try {
    const decodedJwt = await verifyAndDecodeJwt(authHeader.slice(7));
    const role = decodedJwt?.payload.role ?? null;
    const isModeratorRoute = isModeratorRouteFn(pathname, req);
    const isAdminRoute = isAdminRouteFn(pathname, req);
    const needToBeAuthenticated = isModeratorRoute || isAdminRoute;

    if (needToBeAuthenticated && !role) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }

    if (isModeratorRoute && !(role === Role.ADMIN || role === Role.MODERATOR)) {
      return Response.json(
        {
          message: `Vous n'avez pas le rôle suffisant (modérateur·ice ou admin) pour effectuer cette action.`,
        },
        { status: 403 },
      );
    }
    if (isAdminRoute && role !== Role.ADMIN) {
      return Response.json(
        {
          message: `Vous n'avez pas le rôle suffisant (admin) pour effectuer cette action.`,
        },
        { status: 403 },
      );
    }
    return NextResponse.next();
  } catch (error) {
    console.error(error);
  }
}
