import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Profile, ProfileClass } from "@/db/profile";
import { connectDB } from "@/lib/db";
import { throwError } from "./error-handling";

export const currentProfile = async (): Promise<
  ProfileClass | NextResponse
> => {
  let profile: ProfileClass;

  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated) {
    return throwError(["Aunauthorized", "Aunauthorized"], 401);
  }

  if (!await connectDB()) {
    return NextResponse.json({});
  }

  const existingAccount = await Profile.find({ userId });

  if (!existingAccount?.length) {
    profile = await Profile.create({
      userId,
    });
  } else {
    profile = existingAccount[0];
  }

  return profile;
};
