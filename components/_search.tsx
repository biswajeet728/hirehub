"use client";

import { Search as SearchIcon } from "lucide-react";
import React, { useState } from "react";

function Search({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: any) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-white/50" />
      </div>
      <input
        type="text"
        placeholder="Search candidates..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white/70 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
      />
    </div>
  );
}

export default Search;
