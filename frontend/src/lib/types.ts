export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  created_at: string;
  is_featured: boolean;             
  application_count?: number;
  applications?: Application[];
};

export type Application = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  created_at: string;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: any;
};