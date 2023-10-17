import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { Profile, ProfileClass } from "@/db/profile";
import connectDB from "@/lib/db";
import { throwError } from "./error-handling";

export const currentProfile = async (): Promise<
  ProfileClass | NextResponse
> => {
  let profile: ProfileClass;

  const { userId } = auth();

  await connectDB();

  if (!userId) {
    return throwError(["Profile not found", "Profile not found"], 404);
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
