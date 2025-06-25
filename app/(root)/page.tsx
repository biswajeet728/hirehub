"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="w-full mt-3 flex-1 flex items-center justify-center flex-col gap-2">
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          // Use deterministic values based on index
          const left = (i * 37 + 13) % 100; // Creates pseudo-random distribution
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-sm font-medium animate-fadeInUp">
          <span className="mr-2">✨</span>
          Connecting talent with opportunity
        </div>

        {/* Main heading */}
        <div className="space-y-4 animate-fadeInUp delay-200">
          <h4 className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-orange-300 via-orange-200 to-white bg-clip-text text-transparent leading-tight">
            Find Your Next Great Hire
          </h4>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-orange-300 via-pink-300 to-white bg-clip-text text-transparent leading-tight">
            Post openings, explore candidates, and connect with future stars.
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed animate-fadeInUp delay-400">
          HireHUB is your all-in-one platform for discovering top talent and
          posting job openings. Whether you're a hiring manager or a job seeker,
          we make it easy to connect, collaborate, and create opportunities.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-fadeInUp delay-600">
          {/* Primary CTA */}
          <Button
            className="group relative rounded-full cursor-pointer px-8 py-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-2xl transition-all duration-300 font-semibold text-lg"
            asChild
          >
            <Link href="/dashboard">
              <span className="relative z-10 flex items-center gap-2">
                Find Talent
                <span className="group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </Button>

          {/* Secondary CTA */}
          <Button className="group rounded-full cursor-pointer px-8 py-6 bg-white/10 text-white border border-white/30 backdrop-blur-md shadow-lg transition-all duration-300 font-semibold text-lg">
            <span className="flex items-center gap-2">
              Post an Opening
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </span>
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-600 {
          animation-delay: 0.6s;
        }

        .delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default page;
