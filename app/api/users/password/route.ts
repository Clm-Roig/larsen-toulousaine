import { authOptions } from "@/utils/authOptions";
import {
  incorrectPreviousPasswordError,
  missingNewPasswordError,
  missingPreviousPasswordError,
  tooShortPasswordError,
} from "@/domain/User/errors";
import { MIN_PASSWORD_LENGTH } from "@/domain/User/constants";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { compare, genSaltSync, hashSync } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  CustomError,
  missingAuthToken,
  missingBodyError,
  mustBeAuthenticatedError,
  toResponse,
} from "@/domain/errors";

export async function PUT(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return toResponse(missingBodyError);
  }

  // Validate data
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return toResponse(mustBeAuthenticatedError);
  }
  const { id: userId } = user;
  const { newPassword, previousPassword } = body;
  let error: CustomError | null = null;
  if (!previousPassword) {
    error = missingPreviousPasswordError;
  }
  if (!newPassword) {
    error = missingNewPasswordError;
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    error = tooShortPasswordError;
  }
  if (error !== null) {
    return toResponse(error);
  }

  try {
    // Check if previous password is ok
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return toResponse(missingAuthToken);
    }
    if (!(await compare(previousPassword, user.password))) {
      return toResponse(incorrectPreviousPasswordError);
    }

    // Update password
    const hashedPassword = hashSync(newPassword, genSaltSync(10));
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    if (error instanceof PrismaClientValidationError) {
      return NextResponse.json(
        {
          message:
            "There was an error with your data when trying to update your password.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "An unexpected error occured." },
      { status: 500 },
    );
  }
}
