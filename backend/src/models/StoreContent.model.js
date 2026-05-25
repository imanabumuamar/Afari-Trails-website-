import mongoose from "mongoose";

const storeContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const StoreContent =
  mongoose.models.StoreContent ??
  mongoose.model("StoreContent", storeContentSchema);
