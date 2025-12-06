import { User } from "@prisma/client";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

// TODO: setup refresh token mechanism to reduce this duration
export const EXPIRATION_TIME_IN_SECONDS = Date.now() + 30 * 24 * 60 * 60; // 30 days

type CustomJWTPayload = JWTPayload & Omit<User, "password">;

export async function signJwtAccessToken(payload: CustomJWTPayload) {
  const secretKey = process.env.NEXTAUTH_SECRET;
  if (!secretKey) {
    throw new Error("Secret key not found!");
  }
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION_TIME_IN_SECONDS)
    .sign(new TextEncoder().encode(secretKey));

  return token;
}

export async function verifyAndDecodeJwt(token: string) {
  try {
    const secretKey = process.env.NEXTAUTH_SECRET;
    if (!secretKey) {
      throw new Error("Secret key not found!");
    }
    if (token) {
      const decodedToken = await jwtVerify<CustomJWTPayload>(
        token,
        new TextEncoder().encode(secretKey),
      );
      return decodedToken;
    }
  } catch (error) {
    console.error("Error while verifying and decoding JWT token:\n", error);
    return null;
  }
}
