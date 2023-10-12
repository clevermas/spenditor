import { auth } from "@clerk/nextjs";

import { Profile, ProfileClass } from "@/db/profile";
import connectDB from "@/lib/db";

export const currentProfile = async (): Promise<ProfileClass | null> => {
  const { userId } = auth();

  await connectDB();

  if (!userId) {
    return null;
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
