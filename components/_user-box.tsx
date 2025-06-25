import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  LogOut,
  User,
  Settings,
  Crown,
  Sparkles,
  Settings2,
  Bookmark,
  Backpack,
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { getLetters } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

async function UserBox() {
  const user = await auth();

  return !user ? (
    <>
      {/* CTA Button */}
      <div className="flex items-center gap-3">
        {/* Sign in link for desktop */}
        <a
          href="/sign-in"
          className="hidden md:block text-white/80 hover:text-white transition-colors duration-200 font-medium hover:underline decoration-2 underline-offset-4"
        >
          Sign In
        </a>

        {/* Primary CTA */}
        <Button
          className="group relative bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:from-orange-600 hover:via-pink-600 hover:to-red-600 text-white border-0 rounded-xl px-4 md:px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          asChild
        >
          <a href="/sign-up" className="flex items-center gap-2">
            <span>Sign Up as HR</span>
            <div className="w-2 h-2 bg-white/60 rounded-full group-hover:bg-white transition-all duration-300 group-hover:scale-125"></div>
          </a>
        </Button>
      </div>
    </>
  ) : (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative cursor-pointer group">
            {/* Glowing ring around avatar */}
            <div className="absolute inset-0 rounded-full"></div>

            {/* Main avatar container */}
            <div className="relative">
              <Avatar className="w-11 h-11 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user?.user?.fullName
                  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                  className="rounded-full"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                  {getLetters(user?.user?.fullName)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 mr-4 md:mr-40 mt-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl p-2">
          {/* User Info Header */}
          <div className="px-3 py-3 border-b border-white/10 mb-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-white/20">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    user?.user?.fullName
                  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                  className="rounded-full"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xs">
                  {getLetters(user?.user?.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {user?.user?.fullName}
                </p>
                <p className="text-slate-400 text-xs truncate">
                  {user?.user?.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">
                    {user?.user?.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenuItem
            asChild
            className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-lg cursor-pointer group"
          >
            <Link href="/dashboard/bookmarks">
              <Bookmark className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
              <span>Bookmarks</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 rounded-lg cursor-pointer group"
          >
            <Link href="/dashboard/jobs">
              <Backpack className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
              <span>Jobs</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-white/10 my-2" />

          {/* Sign Out */}

          <form
            action={async () => {
              "use server";

              await signOut();
              redirect("/");
            }}
          >
            <Button
              className="w-full justify-start px-3 py-2 bg-transparent hover:bg-red-500/20 hover:text-red-400 text-white/80 transition-all duration-200 rounded-lg group h-auto font-normal cursor-pointer"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
              <span>Sign Out</span>
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserBox;
