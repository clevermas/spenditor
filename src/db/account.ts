import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ModelOptions({
  schemaOptions: {
    collection: "accounts",
  },
})
class AccountClass {
  id?: string;
  _id?: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  profileId: string;

  @prop({ required: true })
  currency: string;

  @prop({ required: true })
  balance: string;
}

const Account =
  mongoose.models["AccountClass"] || getModelForClass(AccountClass);

export { Account, AccountClass };
