import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const AboutContent =
  mongoose.models.AboutContent ??
  mongoose.model("AboutContent", aboutContentSchema);
