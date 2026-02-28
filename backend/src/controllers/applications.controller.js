const { Job, Application } = require("../models");
const { createApplicationSchema } = require("../validators/application.validator");
const { created, badRequest, notFound } = require("../utils/response");
const { asyncHandler } = require("../utils/asyncHandler");

// POST /api/applications
const createApplication = asyncHandler(async (req, res) => {
  const parsed = createApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return badRequest(res, "Validation error", parsed.error.flatten());
  }

  const { job_id, name, email, resume_link, cover_note } = parsed.data;

  const job = await Job.findByPk(job_id);
  if (!job) return notFound(res, "Job not found");

  const application = await Application.create({
    job_id,
    name,
    email,
    resume_link,
    cover_note,
  });

  return created(res, application, "Application submitted");
});

module.exports = { createApplication };