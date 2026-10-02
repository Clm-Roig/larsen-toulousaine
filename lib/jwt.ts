import { User } from "@prisma/client";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

// ==== If you modify AUTH_MAX_AGE, make sure to also update expirationTime ==== //
export const AUTH_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const expirationTime = "30d";

type CustomJWTPayload = JWTPayload & Omit<User, "password">;

export async function signJwtAccessToken(payload: CustomJWTPayload) {
  const secretKey = process.env.NEXTAUTH_SECRET;
  if (!secretKey) throw new Error("Secret key not found!");

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(new TextEncoder().encode(secretKey));
}

export async function verifyAndDecodeJwt(token: string) {
  try {
    const secretKey = process.env.NEXTAUTH_SECRET;
    if (!secretKey) throw new Error("Secret key not found!");

    if (token) {
      return await jwtVerify<CustomJWTPayload>(
        token,
        new TextEncoder().encode(secretKey),
      );
    }
  } catch (error) {
    console.error("Error while verifying JWT token:", error);
    return null;
  }
}
