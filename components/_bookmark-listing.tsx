import { Candidate } from "@/types/types";
import React from "react";
import CandidateCard from "./_candidate-card";

function BookmarkListing({ jobs }: { jobs: Candidate[] }) {
  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 mb-4 text-gray-800">
          <span className="text-2xl font-bold text-stone-50">
            Bookmark Listings
          </span>
          <span className="text-sm text-gray-200"> ({jobs?.length})</span>
        </h2>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6"></div>

      <div className="mt-5 max-h-[calc(100vh-220px)] overflow-y-auto hide-scrollbar">
        {jobs.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No bookmarked candidates found.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <CandidateCard key={job._id} candidate={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BookmarkListing;
