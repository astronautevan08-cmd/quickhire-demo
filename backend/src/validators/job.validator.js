const { z } = require("zod");

const createJobSchema = z.object({
  title: z.string().min(1, "title is required"),
  company: z.string().min(1, "company is required"),
  location: z.string().min(1, "location is required"),
  category: z.string().min(1, "category is required"),
  description: z.string().min(1, "description is required"),
});

module.exports = { createJobSchema };