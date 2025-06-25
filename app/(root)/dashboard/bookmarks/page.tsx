import { auth } from "@/auth";
import BookmarkListing from "@/components/_bookmark-listing";
import JobListing from "@/components/_job-listing";
import { getBookmarks } from "@/lib/action";
import { Candidate, JobPostingType } from "@/types/types";
import { redirect } from "next/navigation";

export default async function BookMarkPage() {
  const res = (await getBookmarks()) as {
    success: boolean;
    data?: Candidate[];
    error?: string;
  };
  const user = await auth();

  const formattedData: any[] = (res.data ?? []).map((bookmark: any) => ({
    _id: bookmark.candidateId._id,
    name: bookmark.candidateId.name,
    email: bookmark.candidateId.email,
    skills: bookmark.candidateId.skills,
    batch: bookmark.candidateId.batch,
    branch: bookmark.candidateId.branch,
    college: bookmark.candidateId.college,
    github: bookmark.candidateId.github,
    linkedin: bookmark.candidateId.linkedin,
    resume: bookmark.candidateId.resume,
    description: bookmark.candidateId.description,
    isBookmarked: true,
    bookmarkId: bookmark._id, // So you can remove the bookmark if needed
  }));

  if (!res.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100">
        <div className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-white/20">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-700">
            {res.error || "Failed to load job listings"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/");
  }

  return <BookmarkListing jobs={formattedData as Candidate[]} />;
}
