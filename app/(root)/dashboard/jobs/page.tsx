import { auth } from "@/auth";
import JobListing from "@/components/_job-listing";
import { getJobPostings } from "@/lib/action";
import { JobPostingType } from "@/types/types";
import { redirect } from "next/navigation";

export default async function JobsPage() {
  const res = (await getJobPostings()) as {
    success: boolean;
    data?: JobPostingType[];
    error?: string;
  };
  const user = await auth();

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

  return <JobListing jobs={res.data as JobPostingType[]} />;
}
