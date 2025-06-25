import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Candidate } from "@/types/types";
import { Calendar, Eye, Linkedin, MapPin, Star } from "lucide-react";
import { BookmarkForm } from "./_book-mark-button";

function CandidateCard({ candidate }: { candidate: Candidate }) {
  // Generate a random avatar from a service that provides consistent avatars
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    candidate.name
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500">
      <CardHeader className="relative pb-4">
        {/* Profile Image */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-blue-400/50 transition-colors duration-300 shadow-lg">
              <img
                src={avatarUrl}
                alt={`${candidate.name} avatar`}
                className="w-full h-full object-cover bg-gradient-to-br from-blue-100 to-purple-100"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
              {candidate.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-slate-300 group-hover:text-slate-200 transition-colors duration-300">
              <MapPin className="w-4 h-4" />
              {candidate.college}
            </CardDescription>
            <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>Batch {candidate.batch}</span>
            </div>
          </div>
        </div>

        <BookmarkForm
          candidateId={candidate._id}
          isBookmarkedStatus={candidate.isBookmarked}
          bookmarkId={candidate.bookmarkId || null}
        />
      </CardHeader>

      <CardContent className="relative">
        {/* Skills Section */}
        <div className="-mt-10">
          <CardDescription>
            {`${candidate.description?.slice(0, 40)}...` ||
              "No description available."}
          </CardDescription>

          <div className="flex items-center gap-2 mb-3 mt-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <h3 className="font-semibold text-white/90">Skills & Expertise</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill, index) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/90 backdrop-blur-sm transition-colors duration-300 hover:scale-105 transform cursor-default"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative pt-4 border-t border-white/10 mt-auto">
        <div className="flex justify-between items-center w-full gap-2">
          <a
            href={`/details/${candidate._id}`}
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 hover:border-green-400/50 rounded-lg text-sm font-medium text-green-200 hover:text-green-100 transition-all duration-300 transform group/link flex-1 justify-center"
          >
            <Eye className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">View Profile</span>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg text-sm font-medium text-blue-200 hover:text-blue-100 transition-all duration-300 transform group/link flex-1 justify-center"
          >
            <Linkedin className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">View Linkedin</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
}

export default CandidateCard;
