import React from "react";
import Link from "next/link";
import { Contact, Sparkles } from "lucide-react";
import UserBox from "./_user-box";
import { auth } from "@/auth";
import MobileNav from "./_mobile-nav";

async function Header() {
  const user = await auth();
  return (
    <header className="relative h-16 md:h-18 mt-5">
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-pink-500/5 rounded-2xl"></div>

        {/* Top highlight */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-between h-full px-6">
        {/* Logo section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          {/* Icon with animated background */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-lg blur-sm group-hover:blur-md transition-all duration-300"></div>
            <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 p-2 rounded-lg shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
              <Contact
                className="text-white h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Brand name */}
          <Link href={"/"}>
            <div className="flex flex-col">
              <span className="text-white text-lg md:text-xl font-bold tracking-wide group-hover:text-orange-300 transition-colors duration-300 flex items-center gap-1">
                {process.env.HEADER_TITLE || "HireHUB"}
                <Sparkles className="h-3 w-3 text-orange-400 animate-pulse" />
              </span>
              <span className="text-xs text-white/60 font-medium -mt-1 hidden md:block">
                Talent Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation items (hidden on mobile, shown on larger screens) */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium relative group"
          >
            Candidates
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          {user && (
            <Link
              href="/dashboard/jobs"
              className="text-white/80 hover:text-white transition-colors duration-200 font-medium relative group"
            >
              Jobs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <UserBox />

          {/* show headers */}
          <div className="md:hidden w-fit">
            <MobileNav />
          </div>
        </div>
      </div>

      {/* Floating elements for extra visual interest */}
      <div className="absolute -top-1 right-20 w-1 h-1 bg-orange-400/60 rounded-full animate-pulse"></div>
      <div className="absolute -bottom-1 left-32 w-1 h-1 bg-pink-400/60 rounded-full animate-pulse delay-1000"></div>
    </header>
  );
}

export default Header;
