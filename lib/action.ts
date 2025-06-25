"use server";

import { auth, signIn } from "@/auth";
import { connectToDB } from "@/db/connection";
import Candidate from "@/db/models/_candidate.model";
import JobPosting from "@/db/models/_job.model";
import User from "@/db/models/_user.model";
import { IUser } from "@/types/types";
import bcrypt from "bcryptjs";
import { jobPostingSchema } from "./validators";
import { revalidatePath } from "next/cache";
import Bookmark from "@/db/models/_bookmark.model";

export async function signUpHandler(params: any) {
  console.log(JSON.stringify(params, null, 2), "Test10");
  const { fullName, email, password, phone } = params;

  try {
    await connectToDB();

    const user = await User.findOne({ email });

    if (user) {
      return {
        success: false,
        error: "User already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone: phone || null,
    });

    await newUser.save();

    await signInNextAuthHandler({ email, password });

    return {
      success: true,
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2), "Test11");
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function signInNextAuthHandler(
  params: Pick<IUser, "email" | "password">
) {
  const { email, password } = params;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      return {
        success: false,
        error: res.error,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2), "Test9");
    return {
      success: false,
      error: "Error occurred while signing in",
    };
  }
}

export async function getCandidates() {
  try {
    await connectToDB();
    const hr = await auth(); // Get current HR user

    const candidates = await Candidate.find({})
      .select("-__v -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    // Map over candidates and check bookmark status for each
    const cleanCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const bookmark = await Bookmark.findOne({
          candidateId: candidate._id,
          hrId: hr?.user.id,
        });

        return {
          ...candidate,
          _id: (candidate._id as any).toString(),
          isBookmarked: !!bookmark,
          bookmarkId: bookmark?._id.toString() || null,
        };
      })
    );

    return {
      success: true,
      data: cleanCandidates,
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2), "Error fetching candidates");
    return {
      success: false,
      error: "Error fetching candidates",
    };
  }
}

export async function getCandidateById(id: string) {
  try {
    await connectToDB();

    const candidate = await Candidate.findById(id)
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!candidate) {
      return {
        success: false,
        error: "Candidate not found",
      };
    }

    // Convert _id to string here
    let cleanCandidate = null;
    if (candidate && !Array.isArray(candidate)) {
      cleanCandidate = {
        ...candidate,
        _id: (candidate._id as { toString: () => string }).toString(),
      };
    }

    // Check if the candidate is bookmarked by the current HR
    const hr = await auth();

    const bookmark = await Bookmark.findOne({
      candidateId: id,
      hrId: hr?.user.id,
    });

    if (bookmark) {
      cleanCandidate = {
        ...cleanCandidate,
        isBookmarked: true,
        bookmarkId: bookmark._id.toString(),
      };
    } else {
      cleanCandidate = {
        ...cleanCandidate,
        isBookmarked: false,
        bookmarkId: null,
      };
    }

    return {
      success: true,
      data: cleanCandidate,
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2), "Error fetching candidate");
    return {
      success: false,
      error: "Error fetching candidate",
    };
  }
}

export const getJobPostings = async () => {
  try {
    await connectToDB();

    const jobPostings = await JobPosting.find({})
      .select("-__v -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    const cleanJobPostings = jobPostings.map((job) => ({
      ...job,
      _id: (job._id as any).toString(),
      createdBy: job.createdBy?.toString(),
      yearOfEstablishment: job.yearOfEstablishment?.toISOString(),
    }));

    return {
      success: true,
      data: cleanJobPostings,
    };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2), "Error fetching job postings");
    return {
      success: false,
      error: "Error fetching job postings",
    };
  }
};

export async function createJobPosting(formData: any) {
  const {
    aboutUs,
    companyLogo,
    companyName,
    companyVision,
    companyWebsite,
    email,
    industryTypes,
    mapLocation,
    organizationType,
    phone,
    socialMediaProfiles,
    teamSize,
    yearOfEstablishment,
  } = formData; // ✅ no JSON.parse()

  try {
    await connectToDB();

    const session = await auth();
    const loggedUser = await User.findOne({ email: session?.user?.email });

    if (!loggedUser) {
      return {
        success: false,
        error: "Access denied | Unauthorized",
      };
    }

    await JobPosting.create({
      aboutUs,
      companyLogo,
      companyName,
      companyVision,
      companyWebsite,
      email,
      industryTypes,
      mapLocation,
      organizationType,
      phone,
      socialMediaProfiles,
      teamSize,
      yearOfEstablishment,
      createdBy: loggedUser._id,
    });

    revalidatePath("/dashboard/jobs");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Job creation error:", error);
    return { success: false, error: error.message };
  }
}

export const createBookmark = async (candidateId: string) => {
  try {
    await connectToDB();

    const hr = await auth();

    if (!hr?.user?.id) {
      return {
        success: false,
        message: "Please Login to Bookmark this Candidate",
      };
    }

    const existing = await Bookmark.findOne({ candidateId, hrId: hr?.user.id });

    if (existing) {
      return { success: false, message: "Already bookmarked" };
    }

    const bookmark = await Bookmark.create({ candidateId, hrId: hr?.user.id });

    revalidatePath("/dashboard"); // Optional: Refresh the bookmarks page
    revalidatePath("/dashboard/bookmarks");

    return { success: true, data: JSON.parse(JSON.stringify(bookmark)) };
  } catch (error: any) {
    console.error("Error creating bookmark:", error);
    return { success: false, message: error.message };
  }
};

export const getBookmarks = async () => {
  try {
    await connectToDB();

    const hr = await auth();

    const bookmarks = await Bookmark.find({ hrId: hr?.user.id })
      .populate("candidateId", "-__v -createdAt -updatedAt")
      .lean();

    const cleanBookmarks = bookmarks.map((bookmark) => ({
      ...bookmark,
      _id: (bookmark._id as any).toString(),
      candidateId: {
        ...bookmark.candidateId,
        _id: (bookmark.candidateId._id as any).toString(),
      },
    }));

    return { success: true, data: cleanBookmarks };
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    return { success: false, message: error.message };
  }
};

export const checkIfCandidateIsBookmarked = async (candidateId: string) => {
  try {
    await connectToDB();

    const hr = await auth();

    const bookmark = await Bookmark.findOne({
      candidateId,
      hrId: hr?.user.id,
    });

    return {
      success: true,
      isBookmarked: !!bookmark,
      bookmarkId: bookmark?._id.toString() || null,
    };
  } catch (error: any) {
    console.error("Error checking bookmark:", error);
    return { success: false, message: error.message };
  }
};

export const deleteBookmark = async (bookmarkId: string) => {
  console.log("Deleting bookmark with ID:", bookmarkId);
  try {
    await connectToDB();

    const hr = await auth();

    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      hrId: hr?.user.id,
    });

    if (!deletedBookmark) {
      return { success: false, message: "Bookmark not found" };
    }

    revalidatePath("/dashboard/bookmarks"); // Optional: Refresh the bookmarks page
    revalidatePath("/dashboard");

    return { success: true, data: JSON.parse(JSON.stringify(deletedBookmark)) };
  } catch (error: any) {
    console.error("Error deleting bookmark:", error);
    return { success: false, message: error.message };
  }
};
