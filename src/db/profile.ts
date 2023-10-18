import mongoose, { Model } from "mongoose";

export interface ProfileClass {
  id?: string;
  _id?: string;

  userId: string;
  name: string;
  email: string;
}

export const ProfileSchema = new mongoose.Schema<ProfileClass>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
});

export const Profile =
  mongoose.models.Profile ||
  (mongoose.model("Profile", ProfileSchema) as Model<ProfileClass>);
