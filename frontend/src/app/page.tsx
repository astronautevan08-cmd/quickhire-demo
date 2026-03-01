"use client";

import { useMemo, useState } from "react";
import QuickHireHeader from "@/components/QuickHireHeader";
import HeroSection from "@/components/HeroSection";
import CompanyLogos from "@/components/CompanyLogos";
import CategorySection from "@/components/CategorySection";
import CTABanner from "@/components/CTABanner";
import FeaturedJobs from "@/components/FeaturedJobs";
import LatestJobs from "@/components/LatestJobs";
import QuickHireFooter from "@/components/QuickHireFooter";
import { useJobs } from "@/hooks/useJobsApi";

export default function HomePage() {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  const { data: jobs, isLoading } = useJobs(filters);

  // const featured = useMemo(() => (jobs || []).slice(0, 4), [jobs]);
  // const latest = useMemo(() => (jobs || []).slice(0, 10), [jobs]);

  const featured = useMemo(() => {
  const list = jobs || [];
  const featuredJobs = list.filter((j) => j.is_featured);
  return (featuredJobs.length ? featuredJobs : list).slice(0, 4);
}, [jobs]);

const latest = useMemo(() => {
  const list = [...(jobs || [])];
  list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  return list.slice(0, 10);
}, [jobs]);

  return (
    <>
      <QuickHireHeader />

      <HeroSection value={filters} onChange={setFilters} />

      <CompanyLogos />
      <CategorySection />

      <CTABanner />
      
      <FeaturedJobs jobs={featured} loading={isLoading} />
      <LatestJobs jobs={latest} loading={isLoading} />

      <QuickHireFooter />
    </>
  );
}