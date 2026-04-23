import mongoose, { Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "partner" | "admin";
  isEmailVerified?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "partner", "admin"]
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      default: undefined
    },
    otpExpiresAt: {
      type: Date,
      default: undefined
    }
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js (important for hot reload)
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;