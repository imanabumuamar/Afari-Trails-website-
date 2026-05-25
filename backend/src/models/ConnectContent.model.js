import mongoose from "mongoose";

const connectContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const ConnectContent =
  mongoose.models.ConnectContent ??
  mongoose.model("ConnectContent", connectContentSchema);
