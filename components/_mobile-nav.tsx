"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Menu } from "lucide-react";

function MobileNav() {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Menu className="h-6 w-6 md:h-8 md:w-8 text-white cursor-pointer hover:text-orange-400 transition-colors duration-200" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 mr-4 md:mr-40 mt-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-2">
          <DropdownMenuItem
            asChild
            className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-lg cursor-pointer group"
          >
            <Link href="/dashboard">
              <span>Candidates</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-lg cursor-pointer group"
          >
            <Link href="/dashboard/jobs">
              <span>Jobs</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default MobileNav;
