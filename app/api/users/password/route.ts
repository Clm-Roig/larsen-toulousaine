import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ERROR_NAMES, updatePasswordErrors } from "@/domain/User/errors";
import { MIN_PASSWORD_LENGTH } from "@/domain/constants";
import prisma from "@/lib/prisma";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { compare, genSaltSync, hashSync } from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const getErrorResponse = (errorName: ERROR_NAMES) => {
  const error = updatePasswordErrors.find((e) => e.name === errorName);
  return NextResponse.json(error, { status: error?.status });
};

export async function PUT(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return getErrorResponse(ERROR_NAMES.MISSING_BODY);
  }

  // Validate data
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user) {
    return getErrorResponse(ERROR_NAMES.MUST_BE_AUTHENTICATED);
  }
  const { id: userId } = user;
  const { newPassword, previousPassword } = body;
  let error: NextResponse | null = null;
  if (!previousPassword) {
    error = getErrorResponse(ERROR_NAMES.MISSING_PREVIOUS_PASSWORD);
  }
  if (!newPassword) {
    error = getErrorResponse(ERROR_NAMES.MISSING_NEW_PASSWORD);
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    error = getErrorResponse(ERROR_NAMES.TOO_SHORT_PASSWORD);
  }
  if (error !== null) {
    return error;
  }

  try {
    // Check if previous password is ok
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      return getErrorResponse(ERROR_NAMES.MISSING_AUTH_TOKEN);
    }
    if (!(await compare(previousPassword, user.password))) {
      return getErrorResponse(ERROR_NAMES.INCORRECT_PREVIOUS_PASSWORD);
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
