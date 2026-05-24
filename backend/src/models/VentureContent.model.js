import mongoose from "mongoose";

const ventureContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const VentureContent =
  mongoose.models.VentureContent ??
  mongoose.model("VentureContent", ventureContentSchema);
