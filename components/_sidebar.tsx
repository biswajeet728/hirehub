"use client";

import {
  SlidersHorizontal,
  Code,
  GraduationCap,
  Calendar,
  Building2,
  X,
  Check,
  Search,
} from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";

function FilterSidebar({
  filters,
  onFiltersApplied,
}: {
  filters: {
    skills: string[];
    branches: string[];
    batches: string[];
    colleges: string[];
    searchQuery: string;
  };
  onFiltersApplied: (newFilters: any) => void;
}) {
  const selectedSkills = filters.skills;
  const selectedBranches = filters.branches;
  const selectedBatches = filters.batches;
  const selectedColleges = filters.colleges;

  const searchValue = filters.searchQuery?.toLowerCase() || "";

  const skills = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Go",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Django",
    "Flask",
    "Spring Boot",
    "Express.js",
  ];

  const branches = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biotechnology",
    "Aerospace",
    "Automobile",
  ];

  const batches = ["2020", "2021", "2022", "2023", "2024"];

  const colleges = [
    "MIT",
    "Stanford",
    "Harvard",
    "IIT Delhi",
    "IIT Bombay",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Madras",
    "NIT Trichy",
  ];

  const toggleSelection = (item: string, key: keyof typeof filters) => {
    const current = filters[key] as string[];
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];

    onFiltersApplied({
      ...filters,
      [key]: updated,
    });
  };

  const clearAllFilters = () => {
    onFiltersApplied({
      skills: [],
      branches: [],
      batches: [],
      colleges: [],
      searchQuery: "",
    });
  };

  const getTotalFilters = () => {
    return (
      selectedSkills.length +
      selectedBranches.length +
      selectedBatches.length +
      selectedColleges.length
    );
  };

  const FilterSection = ({
    title,
    icon,
    items,
    selectedItems,
    keyName,
  }: {
    title: string;
    icon: React.ReactNode;
    items: string[];
    selectedItems: string[];
    keyName: keyof typeof filters;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-lg">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-white tracking-wide">
            {title}
          </h3>
        </div>
        {selectedItems.length > 0 && (
          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs font-medium rounded-full">
            {selectedItems.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          return (
            <Button
              variant="outline"
              key={item}
              onClick={() => toggleSelection(item, keyName)}
              className={`relative flex items-center justify-between p-3 rounded-xl border transition-all duration-300 cursor-pointer hover:bg-transparent ${
                isSelected
                  ? "from-orange-500/20 to-pink-500/20 border-orange-500/50"
                  : "bg-slate-800/50 border-white/10"
              }`}
            >
              <span className="text-sm font-medium text-white/70">{item}</span>

              {isSelected && (
                <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full">
                  <Check className="h-3 w-3 text-white" strokeWidth={2} />
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-sm">
      <div className="relative z-10 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 p-2.5 rounded-lg shadow-lg">
                <SlidersHorizontal
                  className="text-white h-4 w-4"
                  strokeWidth={2}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Filters</h2>
              <p className="text-xs text-white/60">Refine your search</p>
            </div>
          </div>

          {getTotalFilters() > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <X className="h-3 w-3" />
              Clear All
            </button>
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="Search filters..."
            className="w-full rounded-lg bg-slate-800/50 border border-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            value={filters.searchQuery}
            onChange={(e) =>
              onFiltersApplied({ ...filters, searchQuery: e.target.value })
            }
          />
        </div>

        <div className="space-y-8 overflow-y-auto max-h-[80vh] md:max-h-[65vh] hide-scrollbar">
          <FilterSection
            title="Skills"
            icon={<Code className="h-4 w-4 text-orange-400" />}
            items={skills.filter((skill) =>
              skill.toLowerCase().includes(searchValue)
            )}
            selectedItems={selectedSkills}
            keyName="skills"
          />

          <FilterSection
            title="Branch"
            icon={<GraduationCap className="h-4 w-4 text-blue-400" />}
            items={branches.filter((branch) =>
              branch.toLowerCase().includes(searchValue)
            )}
            selectedItems={selectedBranches}
            keyName="branches"
          />

          <FilterSection
            title="Batch"
            icon={<Calendar className="h-4 w-4 text-green-400" />}
            items={batches.filter((batch) =>
              batch.toLowerCase().includes(searchValue)
            )}
            selectedItems={selectedBatches}
            keyName="batches"
          />

          <FilterSection
            title="Colleges"
            icon={<Building2 className="h-4 w-4 text-purple-400" />}
            items={colleges.filter((college) =>
              college.toLowerCase().includes(searchValue)
            )}
            selectedItems={selectedColleges}
            keyName="colleges"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
