import mongoose from "mongoose";

const inquirySubmissionSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
      enum: [
        "contact",
        "expeditions-connect",
        "ventures-connect",
        "partner",
        "expedition",
        "newsletter",
      ],
    },
    name: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    company: { type: String, trim: true },
    inquiryType: { type: String, trim: true },
    partnershipType: { type: String, trim: true },
    message: { type: String, trim: true },
    expeditionId: { type: String, trim: true },
    expeditionName: { type: String, trim: true },
    dates: { type: String, trim: true },
    guests: { type: String, trim: true },
    pageUrl: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
);

inquirySubmissionSchema.index({ createdAt: -1 });
inquirySubmissionSchema.index({ email: 1, createdAt: -1 });
inquirySubmissionSchema.index({ ip: 1, createdAt: -1 });

export const InquirySubmission =
  mongoose.models.InquirySubmission ??
  mongoose.model("InquirySubmission", inquirySubmissionSchema);
