import { getModelForClass, ModelOptions, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

@ModelOptions({
  schemaOptions: {
    collection: "profiles",
  },
})
class ProfileClass {
  @prop({ required: true, unique: true })
  userId: string;

  @prop()
  name: string;

  @prop()
  email: string;
}

const Profile =
  mongoose.models["ProfileClass"] || getModelForClass(ProfileClass);

export { Profile, ProfileClass };
