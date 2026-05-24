import mongoose from "mongoose";

const archiveContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ArchiveContent =
  mongoose.models.ArchiveContent ??
  mongoose.model("ArchiveContent", archiveContentSchema);
