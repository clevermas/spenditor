import mongoose, { Model } from "mongoose";

export interface TransactionClass {
  id?: string;
  _id?: string;

  profileId: string;
  accountId: string;
  type: string;
  amount: string;
  date: Date;
  category: string;
  tags: string[];
  comment: string;
}

export const TransactionSchema = new mongoose.Schema<TransactionClass>({
  profileId: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],

  comment: String,
});

export const Transaction =
  mongoose.models.Transaction ||
  (mongoose.model("Transaction", TransactionSchema) as Model<TransactionClass>);
