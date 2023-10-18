import mongoose, { Model } from "mongoose";

export interface AccountClass {
  id?: string;
  _id?: string;
  name: string;
  profileId: string;
  currency: string;
  balance: string;
}

export const AccountSchema = new mongoose.Schema<AccountClass>({
  name: {
    type: String,
    required: true,
  },

  profileId: {
    type: String,
    required: true,
  },

  currency: {
    type: String,
    required: true,
  },

  balance: {
    type: String,
    required: true,
  },
});

export const Account =
  mongoose.models.Account ||
  (mongoose.model("Account", AccountSchema) as Model<AccountClass>);
