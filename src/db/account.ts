import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ModelOptions({
  schemaOptions: {
    collection: "accounts",
  },
})
class AccountClass {
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
