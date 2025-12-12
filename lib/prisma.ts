import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  prisma = global.prisma ?? new PrismaClient();
}

export default prisma;
