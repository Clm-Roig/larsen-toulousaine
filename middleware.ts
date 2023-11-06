import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeJwt } from "@/lib/jwt";

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith("/api/users");
};

const isUserRoute = (pathname: string) => {
  return pathname.startsWith("/api/users");
};

// eslint-disable-next-line @typescript-eslint/require-await
export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const { pathname } = req.nextUrl;

  try {
    const decodedJwt = await verifyAndDecodeJwt(authHeader.slice(7));
    const role = decodedJwt?.payload?.role || ("" as Role);
    if (isUserRoute(pathname) && ![Role.ADMIN, Role.MODERATOR].includes(role)) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }
    if (isAdminRoute(pathname) && role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/api/auth/unauthorized", req.url));
    }
    return NextResponse.next();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
