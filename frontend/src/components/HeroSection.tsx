"use client";

import { Search, MapPin } from "lucide-react";
import Image from "next/image";
import heroPerson from "@/assets/hero-person.png";

type HeroFilters = {
  search: string;
  location: string;
  category: string;
};

type HeroSectionProps = {
  value: HeroFilters;
  onChange: (v: HeroFilters) => void;
};

const HeroSection = ({ value, onChange }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 max-w-xl">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Discover<br />
            more than<br />
            <span className="text-primary">5000+ Jobs</span>
          </h1>

          <div className="mt-1 mb-6">
            <svg width="200" height="12" viewBox="0 0 200 12" fill="none">
              <path
                d="M2 8C40 2 80 2 120 6C140 8 170 10 198 4"
                stroke="hsl(var(--cyan))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M2 10C50 4 90 3 130 7C155 9 175 10 198 6"
                stroke="hsl(var(--cyan))"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>

          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md">
            Great platform for the job seeker that searching for new career heights and passionate about startups.
          </p>

          {/* Search Bar */}
          <div className="bg-background border border-border rounded-lg shadow-sm flex flex-col sm:flex-row items-stretch overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={value.search}
                onChange={(e) => onChange({ ...value, search: e.target.value })}
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>

            <div className="flex items-center gap-2 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-border">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Location"
                value={value.location}
                onChange={(e) => onChange({ ...value, location: e.target.value })}
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>

            {/* This button is optional (filters already update live). Keep it for UI. */}
            <button
              type="button"
              className="bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
              onClick={() => onChange({ ...value })}
            >
              Search my job
            </button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Popular : <span className="text-foreground">UI Designer, UX Researcher, Android, Admin</span>
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-muted rounded-tl-[80px] rounded-br-[80px] -z-10 scale-95" />
            <Image
              src={heroPerson}
              width={600}
              height={700}
              priority
              alt="Professional job seeker"
              className="w-full max-w-md object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;