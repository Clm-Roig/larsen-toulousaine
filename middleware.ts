import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeJwt } from "@/lib/jwt";

const isAdminRoute = (pathname: string, req: NextRequest) => {
  const conditions = [
    pathname.startsWith("/api/users") &&
      ["POST", "DELETE"].includes(req.method),
  ];
  return conditions.includes(true);
};

const isModeratorRoute = (pathname: string, req: NextRequest) => {
  const conditions = [
    pathname.startsWith("/api/users") && ["PUT", "PATCH"].includes(req.method),
    pathname.startsWith("/api/gigs") &&
      ["POST", "DELETE", "PUT", "PATCH"].includes(req.method),
    pathname.startsWith("/api/gigs/missingData") &&
      ["GET"].includes(req.method),
    pathname.startsWith("/api/bands") &&
      ["POST", "DELETE", "PUT", "PATCH", "GET"].includes(req.method),
    pathname.startsWith("/api/places") &&
      ["POST", "DELETE", "PUT", "PATCH"].includes(req.method),
  ];
  return conditions.includes(true);
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const { pathname } = req.nextUrl;

  try {
    const decodedJwt = await verifyAndDecodeJwt(authHeader.slice(7));
    const role = decodedJwt?.payload?.role || ("" as Role);
    if (
      isModeratorRoute(pathname, req) &&
      ![Role.ADMIN, Role.MODERATOR].includes(role)
    ) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }
    if (isAdminRoute(pathname, req) && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
