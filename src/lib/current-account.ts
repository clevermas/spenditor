import { Account, AccountClass } from "@/db/account";
import { ProfileClass } from "@/db/profile";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export const currentAccount = async (
  withProfile = false
): Promise<
  AccountClass | { profile: ProfileClass; account: AccountClass } | NextResponse
> => {
  const profile = await currentProfile();

  if (profile instanceof NextResponse) {
    return profile;
  }

  let account = await Account.find({ profileId: profile.id });

  if (!account?.length) {
    account = await Account.create({
      name: "Cash",
      profileId: profile.id,
      currency: "USD",
      balance: "0",
    });
  } else {
    account = account[0];
  }

  return withProfile
    ? { account: account as AccountClass, profile: profile as ProfileClass }
    : account;
};
