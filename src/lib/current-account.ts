import { Account, AccountClass } from "@/db/account";
import { ProfileClass } from "@/db/profile";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";

export const currentAccount = async (
  withProfile = false
): Promise<
  AccountClass | { profile: ProfileClass; account: AccountClass } | NextResponse
> => {
  let account: AccountClass;
  const profile = await currentProfile();

  if (profile instanceof NextResponse) {
    return profile;
  }

  const existingAccount = await Account.find({
    profileId: profile.id,
  });

  if (!existingAccount.length) {
    account = await Account.create({
      name: "Cash",
      profileId: profile.id,
      currency: "USD",
      balance: "0",
    });
  } else {
    account = existingAccount[0];
  }

  return withProfile ? { account, profile } : account;
};
