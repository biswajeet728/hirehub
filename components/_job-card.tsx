"use client";

import { JobPostingType } from "@/types/types";
import React from "react";
import Image from "next/image";
import {
  Building,
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Briefcase,
} from "lucide-react";
import { format, parseISO } from "date-fns";

function JobCard({ job }: { job: JobPostingType }) {
  const formattedDate = format(
    parseISO(job.yearOfEstablishment as string),
    "d MMMM yyyy"
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/40 via-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 p-6 rounded-md group hover:shadow-indigo-500/20">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-white/10 bg-white/5 shadow-inner">
            <Image
              src={job.companyLogo!}
              alt={job.companyName}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {job.companyName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30">
                {job.organizationType}
              </span>
              {job.industryTypes?.map((type, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs rounded-full border ${
                    type === "Education"
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      : "bg-green-500/20 text-green-300 border-green-500/30"
                  }`}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* About section */}
        <div className="mb-4">
          <p className="text-gray-300 text-sm line-clamp-2 italic">
            {job.aboutUs}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-md p-3 mb-4">
          <h4 className="text-indigo-300 text-sm font-medium mb-1">
            Company Vision
          </h4>
          <p className="text-gray-300 text-sm">{job.companyVision}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300 text-sm">
              Est. {job.yearOfEstablishment}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300 text-sm">
              {job.teamSize} employees
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-indigo-400" />
            <span className="text-gray-300 text-sm truncate">
              {job.mapLocation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-indigo-400" />
            <a
              href={job.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-300 text-sm hover:text-indigo-200 truncate"
            >
              Website
            </a>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-md p-3 mb-4">
          <h4 className="text-indigo-300 text-sm font-medium mb-2">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-400" />
              <span className="text-gray-300 text-sm">{job.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-400" />
              <span className="text-gray-300 text-sm">{job.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {job.socialMediaProfiles?.map((profile, index) => (
            <a
              key={index}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs text-gray-300 transition-colors flex items-center gap-1"
            >
              {getSocialIcon(profile.platform)}
              {profile.platform}
            </a>
          ))}
        </div>

        {/* <button className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-md transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
          <Briefcase className="h-4 w-4" />
          View Job Details
        </button> */}
      </div>
    </div>
  );
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      );
    default:
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      );
  }
}

export default JobCard;
