import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { Profile, ProfileClass } from "@/db/profile";
import connectDB from "@/lib/db";
import { throwError } from "./error-handling";

export const currentProfile = async (): Promise<
  ProfileClass | NextResponse
> => {
  const { userId } = auth();

  await connectDB();

  if (!userId) {
    return throwError(["Profile not found", "Profile not found"], 404);
  }

  let profile = await Profile.find({ userId });

  if (!profile?.length) {
    profile = await Profile.create({
      userId,
    });
  } else {
    profile = profile[0];
  }

  return profile;
};
