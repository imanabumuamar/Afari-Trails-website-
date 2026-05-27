import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitAmount: { type: Number, required: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    paymentMethod: {
      type: String,
      enum: ["stripe", "manual"],
      required: true,
    },
    stripeSessionId: { type: String, trim: true, sparse: true },
    stripePaymentIntentId: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "pending",
        "awaiting_payment",
        "paid",
        "cancelled",
        "expired",
      ],
      default: "pending",
    },
    email: { type: String, trim: true, lowercase: true },
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    shippingAddress: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    notes: { type: String, trim: true },
    amountTotal: { type: Number },
    currency: { type: String, default: "usd" },
    items: { type: [orderItemSchema], default: [] },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ email: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order ?? mongoose.model("Order", orderSchema);
