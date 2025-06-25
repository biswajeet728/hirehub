import { IUser } from "@/types/types";
import mongoose, { model, models } from "mongoose";

export const userSchema = new mongoose.Schema<IUser>({
  fullName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
  },
  role: {
    type: mongoose.Schema.Types.String,
    default: "hr",
  },
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
