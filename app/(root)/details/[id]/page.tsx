import { auth } from "@/auth";
import { BookmarkForm } from "@/components/_book-mark-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCandidateById } from "@/lib/action";
import { getLetters } from "@/lib/utils";
import { Candidate } from "@/types/types";
import {
  EyeIcon,
  FileIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  GraduationCapIcon,
  StarIcon,
} from "lucide-react";
import React from "react";

type CandidateParams = {
  params: Promise<{ id: string }>;
};

async function page({ params }: CandidateParams) {
  const { id } = await params;
  const { data: candidate } = (await getCandidateById(id)) as unknown as {
    data: Candidate;
  };
  const user = await auth();

  return (
    <div className="max-w-full mt-8">
      <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-xl">
        {/* Banner with gradient */}
        <div className="h-48 bg-gradient-to-r from-orange-200 to-slate-100"></div>

        <div className="px-8 pb-8 relative">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col md:flex-row justify-between -mt-20 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              <Avatar className="h-40 w-40 border-4 border-slate-900 shadow-lg ring-2 ring-indigo-500/50">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/personas/svg?seed=${candidate?.name}`}
                />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold">
                  {getLetters(candidate?.name)}
                </AvatarFallback>
              </Avatar>

              <div className="text-center md:text-left mt-4 md:mt-0">
                <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">
                  {candidate.name}
                </h1>
                <p className="text-indigo-300 text-lg">
                  {candidate.description}
                </p>
              </div>

              {!!user && (
                <div className="absolute top-5 right-5">
                  <BookmarkForm
                    candidateId={candidate._id}
                    isBookmarkedStatus={candidate.isBookmarked}
                    bookmarkId={candidate.bookmarkId || null}
                  />
                </div>
              )}
            </div>

            {/* <div className="flex gap-3 mt-6 md:mt-0">
              <Button
                variant="outline"
                className="bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700 hover:text-indigo-200 flex items-center gap-2 backdrop-blur-sm transition-all"
              >
                <EyeIcon size={16} /> View Resume
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white transition-all">
                Contact Candidate
              </Button>
            </div> */}
          </div>

          {/* Content Area */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 shadow-inner border border-slate-700/50">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-300">
                    <GraduationCapIcon size={18} />
                  </div>
                  <span>Education</span>
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 rounded-full">
                      <GraduationCapIcon
                        className="text-indigo-300"
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {candidate.college}
                      </p>
                      <p className="text-indigo-200/70">
                        {candidate.branch}, Batch {candidate.batch}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-300">
                    <MailIcon size={18} />
                  </div>
                  <span>Contact</span>
                </h2>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-3 rounded-full">
                      <MailIcon className="text-indigo-300" size={20} />
                    </div>
                    <a
                      href={`mailto:${candidate.email}`}
                      className="text-indigo-200 hover:text-white transition-colors"
                    >
                      {candidate.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8 space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                <div className="p-2 rounded-full bg-indigo-500/20 text-yellow-300">
                  <StarIcon size={18} />
                </div>
                <span>Skills & Expertise</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-slate-800 to-slate-800/80 hover:from-indigo-900/70 hover:to-purple-900/70 text-indigo-100 py-2 px-4 rounded-md border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* External Links */}
            <div className="flex flex-wrap gap-3">
              <a
                href={candidate.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 px-5 rounded-lg text-sm text-white border border-slate-700 hover:border-indigo-500/50 transition-all group"
              >
                <GithubIcon
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-300 transition-colors"
                />
                <span className="group-hover:text-indigo-200 transition-colors">
                  GitHub Profile
                </span>
              </a>
              <a
                href={candidate.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 px-5 rounded-lg text-sm text-white border border-slate-700 hover:border-indigo-500/50 transition-all group"
              >
                <LinkedinIcon
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-300 transition-colors"
                />
                <span className="group-hover:text-indigo-200 transition-colors">
                  LinkedIn Profile
                </span>
              </a>
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 py-3 px-5 rounded-lg text-sm text-white border border-slate-700 hover:border-indigo-500/50 transition-all group"
              >
                <FileIcon
                  size={16}
                  className="text-slate-400 group-hover:text-indigo-300 transition-colors"
                />
                <span className="group-hover:text-indigo-200 transition-colors">
                  View Resume
                </span>
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default page;
