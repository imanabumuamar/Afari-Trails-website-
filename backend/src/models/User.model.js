import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ROLES,
      default: "viewer",
    },
  },
  { timestamps: true },
);

export const User =
  mongoose.models.User ?? mongoose.model("User", userSchema);
