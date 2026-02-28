const { z } = require("zod");

const createApplicationSchema = z.object({
  job_id: z.string().min(1, "job_id is required"),
  name: z.string().min(1, "name is required"),
  email: z.string().email("invalid email"),
  resume_link: z.string().url("resume_link must be a valid URL"),
  cover_note: z.string().min(1, "cover_note is required"),
});

module.exports = { createApplicationSchema };