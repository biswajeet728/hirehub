import { JobPostingType } from "@/types/types";
import mongoose from "mongoose";

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true }, // e.g., Facebook, Twitter
    url: { type: String, required: true },
  },
  { _id: false }
);

const jobPostingSchema = new mongoose.Schema<JobPostingType>(
  {
    // Step 1: Company Info
    companyName: { type: String, required: true },
    companyLogo: { type: String }, // URL or uploaded path
    bannerImage: { type: String },
    aboutUs: { type: String },

    // Step 2: Founding Info
    organizationType: { type: String }, // e.g., Private, Government
    industryTypes: [{ type: String }],
    teamSize: { type: String },
    yearOfEstablishment: { type: String },
    companyWebsite: { type: String },
    companyVision: { type: String },

    // Step 3: Social Media
    socialMediaProfiles: [socialLinkSchema],

    // Step 4: Contact Info
    mapLocation: { type: String }, // text address or geo string
    phone: { type: String },
    email: { type: String },

    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or "HR" if you have an HR model
      required: true,
    },
  },
  { timestamps: true }
);

const JobPosting =
  mongoose.models.JobPosting || mongoose.model("JobPosting", jobPostingSchema);

export default JobPosting;
