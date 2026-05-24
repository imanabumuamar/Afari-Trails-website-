import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const ctaSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const heroSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    subtext: { type: String, required: true },
    poster: { type: imageSchema, required: true },
    video: { type: String, required: true },
    primaryCta: { type: ctaSchema, required: true },
    secondaryCta: { type: ctaSchema, required: true },
  },
  { _id: false },
);

const homepageSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, default: "main" },
    hero: { type: heroSchema, required: true },
    featureCards: {
      expeditions: { type: imageSchema, required: true },
      ventures: { type: imageSchema, required: true },
      store: { type: imageSchema, required: true },
    },
    ourEssence: { type: imageSchema, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const HomepageContent =
  mongoose.models.HomepageContent ??
  mongoose.model("HomepageContent", homepageSchema);
