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
        "archive-submit",
      ],
    },
    name: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, default: null },
    company: { type: String, trim: true },
    inquiryType: { type: String, trim: true },
    partnershipType: { type: String, trim: true },
    message: { type: String, trim: true },
    expeditionId: { type: String, trim: true },
    expeditionName: { type: String, trim: true },
    dates: { type: String, trim: true },
    guests: { type: String, trim: true },
    pageUrl: { type: String, trim: true },
    photoUrl: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    archivedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

inquirySubmissionSchema.index({ archivedAt: 1, createdAt: -1 });
inquirySubmissionSchema.index({ createdAt: -1 });
inquirySubmissionSchema.index({ email: 1, createdAt: -1 });
inquirySubmissionSchema.index({ ip: 1, createdAt: -1 });

export const InquirySubmission =
  mongoose.models.InquirySubmission ??
  mongoose.model("InquirySubmission", inquirySubmissionSchema);
