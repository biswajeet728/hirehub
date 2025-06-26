"use client";

import CandidateCard from "@/components/_candidate-card";
import Search from "@/components/_search";
import FilterSidebar from "@/components/_sidebar";
import { getCandidates } from "@/lib/action";
import { Candidate } from "@/types/types";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

function Page() {
  const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    branches: [] as string[],
    batches: [] as string[],
    colleges: [] as string[],
    searchQuery: "",
  });
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  useEffect(() => {
    // Fetch candidates data on component mount
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCandidates();
        const candidates = data?.data || [];
        setCandidatesData(candidates as any);
        setFilteredCandidates(candidates as any);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    if (!loading && candidatesData.length > 0) {
      const filtered = candidatesData.filter((candidate) => {
        // Check if candidate matches all selected filters
        const matchesSkills =
          filters.skills.length === 0 ||
          filters.skills.some((skill) => candidate.skills?.includes(skill));

        const matchesBranch =
          filters.branches.length === 0 ||
          filters.branches.includes(candidate.branch);

        const matchesBatch =
          filters.batches.length === 0 ||
          filters.batches.includes(candidate.batch?.toString());

        const matchesCollege =
          filters.colleges.length === 0 ||
          filters.colleges.includes(candidate.college);

        const matchesSearch =
          !filters.searchQuery ||
          candidate.name
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          candidate.skills?.some((skill) =>
            skill.toLowerCase().includes(filters.searchQuery.toLowerCase())
          ) ||
          candidate.college
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          candidate.branch
            ?.toLowerCase()
            .includes(filters.searchQuery.toLowerCase());

        return (
          matchesSkills &&
          matchesBranch &&
          matchesBatch &&
          matchesCollege &&
          matchesSearch
        );
      });

      setFilteredCandidates(filtered);
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  }, [filters, candidatesData, loading]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIndex = (currentPage - 1) * candidatesPerPage;
  const endIndex = startIndex + candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Function to handle filter updates from FilterSidebar
  const handleFiltersApplied = (newFilters: any) => {
    setFilters(newFilters);
    // if (window.innerWidth < 768) {
    //   setShowMobileFilters(false);
    // }
  };

  // Function to handle search input
  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
  };

  // Toggle mobile filters
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <>
      <div className="relative w-full h-[calc(100vh-120px)] flex gap-3 overflow-hidden mt-3">
        {/* Background Particles */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {[...Array(20)].map((_, i) => {
            const left = (i * 37 + 13) % 100;
            const top = (i * 23 + 7) % 100;
            const delay = (i * 0.3) % 3;
            const duration = 2 + ((i * 0.2) % 2);

            return (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              ></div>
            );
          })}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-[0.25] bg-gradient-to-r from-slate-800/30 via-slate-700/20 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl h-full">
          <FilterSidebar
            onFiltersApplied={handleFiltersApplied}
            filters={filters}
          />
        </div>

        <div className="flex-1 lg:flex-[0.75] bg-gradient-to-r from-slate-800/30 via-slate-700/20 to-slate-800/30 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl h-full flex flex-col">
          <div className="p-4">
            <div className="relative flex items-center">
              <div className="flex-1">
                <Search onSearch={handleSearch} />
              </div>

              {/* Filter Button for mobile */}

              <div
                className="lg:hidden ml-2 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-white/10 text-white/70 hover:text-white transition-all duration-200"
                onClick={toggleMobileFilters}
                role="button"
                aria-label="Toggle Filters"
              >
                <Filter size={18} />
              </div>

              {/* <Sheet>
              <SheetTrigger asChild>
                <div className="md:hidden ml-2 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-white/10 text-white/70 hover:text-white transition-all duration-200">
                  <Filter size={18} />
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="w-full md:w-64">
                <FilterSidebar onFiltersApplied={handleFiltersApplied} />
              </SheetContent>
            </Sheet> */}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* Main content area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-3 gap-3">
                {loading ? (
                  <div className="col-span-3 text-center text-white/70 flex items-center justify-center h-[750px] rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-orange-500 rounded-full animate-spin mb-2"></div>
                      Loading candidates...
                    </div>
                  </div>
                ) : currentCandidates.length > 0 ? (
                  currentCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate._id}
                      candidate={candidate as Candidate}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center text-white/70 border border-slate-50/20 flex items-center justify-center h-32 rounded-lg">
                    No candidates found matching the selected filters.
                  </div>
                )}
              </div>
            </div>

            {/* Pagination Controls */}
            {!loading && filteredCandidates.length > 0 && (
              <div className="p-4 border-t border-white/10 -z-10">
                <div className="flex flex-col md:flex-row gap-2.5 items-center justify-between ">
                  {/* Results info */}
                  <div className="text-sm text-white/70">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredCandidates.length)} of{" "}
                    {filteredCandidates.length} candidates
                  </div>

                  {/* Pagination controls */}
                  <div className="flex items-center gap-2">
                    {/* Previous button */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/50 border border-white/10 text-white/70 hover:bg-slate-600/50 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-white/70 cursor-pointer"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Next button */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/50 border border-white/10 text-white/70 hover:bg-slate-600/50 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-white/70 cursor-pointer"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "md:hidden absolute left-0 top-0 bg-[rgba(22,25,29,10)] h-full w-[420px] z-50 transform transition-transform duration-300 pb-10",
          {
            "translate-x-0": showMobileFilters,
            "-translate-x-full": !showMobileFilters,
          }
        )}
      >
        <FilterSidebar
          onFiltersApplied={handleFiltersApplied}
          filters={filters}
        />

        {/* add a close icon */}
        <button
          onClick={() => setShowMobileFilters(false)}
          className="absolute top-4 right-5 text-white cursor-pointer hover:text-orange-500 transition-colors duration-200 rounded-full p-2 bg-slate-700/50 hover:bg-slate-600/50 border border-white/10 z-50"
        >
          <X size={18} />
        </button>
      </div>
    </>
  );
}

export default Page;
