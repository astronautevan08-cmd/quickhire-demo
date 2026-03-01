import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchJobs,
  fetchJob,
  createJob,
  deleteJob,
  createApplication,
} from "@/lib/api";

type ApplyBody = {
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
};

export function useJobs(filters: {
  search?: string;
  category?: string;
  location?: string;
}) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJob(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobs"] }),
  });
}

export function useCreateApplication() {
  return useMutation({
    mutationFn: (body: ApplyBody) => createApplication(body),
  });
}