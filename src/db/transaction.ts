import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ModelOptions({
  schemaOptions: {
    collection: "transactions",
  },
})
class TransactionClass {
  id?: string;
  _id?: string;

  @prop({ required: true })
  profileId: string;

  @prop({ required: true })
  accountId: string;

  @prop({ required: true })
  type: string;

  @prop({ required: true })
  amount: string;

  @prop({ required: true })
  date: Date;

  @prop({ required: true })
  category: string;

  @prop({ type: String, default: [] })
  public tags!: mongoose.Types.Array<string>;

  @prop()
  comment: string;
}

const Transaction =
  mongoose.models["TransactionClass"] || getModelForClass(TransactionClass);
export { Transaction, TransactionClass };
