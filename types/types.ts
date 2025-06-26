import mongoose from "mongoose";

export type ROLE = "user" | "hr";

export type Candidate = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  college: string;
  batch: string;
  branch: string;
  github: string;
  linkedin: string;
  resume: string;
  description?: string;
  isBookmarked?: boolean;
  bookmarkId?: string | null;
};

export interface IUser {
  _id: mongoose.ObjectId;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: ROLE;
}

export interface SocialMediaProfile {
  platform: string;
  url: string;
}

export interface JobPostingType {
  _id?: string;
  companyName: string;
  companyLogo?: string;
  bannerImage?: string;
  aboutUs?: string;

  organizationType?: string;
  industryTypes?: string[];
  teamSize?: string;
  yearOfEstablishment?: string;
  companyWebsite?: string;
  companyVision?: string;

  socialMediaProfiles?: SocialMediaProfile[];

  mapLocation?: string;
  phone?: string;
  email?: string;

  createdBy: mongoose.Schema.Types.ObjectId | IUser;
}

export interface BookmarkType {
  candidateId: {
    _id: string;
    name: string;
    email: string;
    skills: string[];
    batch: string;
    branch: string;
    college: string;
    github: string;
    linkedin: string;
    resume: string;
    description: string;
  };
}
