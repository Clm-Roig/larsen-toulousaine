"use server";

import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createGig(gig: Prisma.GigCreateInput) {
  const createdGig = await prisma.gig.create({
    data: gig,
  });
  return createdGig;
}
