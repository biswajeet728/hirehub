import { JobPostingType } from "@/types/types";
import React from "react";
import JobCard from "./_job-card";
import AddJobPostingModal from "./_post-job-modal";

function JobListing({ jobs }: { jobs: JobPostingType[] }) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex flex-col md:flex-row items-start md:items-start gap-2 mb-4 text-gray-800">
          <span className="text-2xl font-bold text-stone-50">Job Listings</span>
          <span className="text-sm text-gray-200">
            {" "}
            ({jobs?.length} available)
          </span>
        </h2>

        <AddJobPostingModal
          defaultValues={{
            companyName: "",
            aboutUs: "",
            organizationType: "",
            industryTypes: [],
            teamSize: "",
            companyWebsite: "",
            companyVision: "",
            socialMediaProfiles: [{ platform: "LinkedIn", url: "" }],
            mapLocation: "",
            phone: "",
            email: "",
          }}
        />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>

      <div className="mt-5 max-h-[calc(100vh-220px)] overflow-y-auto hide-scrollbar">
        {jobs.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No job listings available at the moment.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-5">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default JobListing;
