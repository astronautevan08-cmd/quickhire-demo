const { Op, Sequelize } = require("sequelize");
const { Job, Application } = require("../models");
const { createJobSchema, updateFeaturedSchema } = require("../validators/job.validator");
const {
  ok,
  created,
  badRequest,
  notFound,
} = require("../utils/response");
const { asyncHandler } = require("../utils/asyncHandler");

// GET /api/jobs?search=&category=&location=
const listJobs = asyncHandler(async (req, res) => {
  const search = (req.query.search || "").trim();
  const category = (req.query.category || "").trim();
  const location = (req.query.location || "").trim();

  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { company: { [Op.iLike]: `%${search}%` } },
    ];
  }
  if (category) where.category = { [Op.iLike]: category };
  if (location) where.location = { [Op.iLike]: location };

  const jobs = await Job.findAll({
    where,
    //  include application_count
    attributes: {
      include: [
        [Sequelize.fn("COUNT", Sequelize.col("applications.id")), "application_count"],
      ],
    },
    include: [
      {
        model: Application,
        as: "applications",
        attributes: [],
        required: false,
      },
    ],
    group: ["Job.id"],
    order: [["created_at", "DESC"]],
  });

  return ok(res, jobs, "Jobs fetched");
});

// GET /api/jobs/:id
const getJobById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByPk(id, {
    include: [{ model: Application, as: "applications" }],
  });

  if (!job) return notFound(res, "Job not found");
  return ok(res, job, "Job fetched");
});

// POST /api/jobs (admin)
const createJob = asyncHandler(async (req, res) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return badRequest(res, "Validation error", parsed.error.flatten());
  }

  const job = await Job.create(parsed.data);
  return created(res, job, "Job created");
});

// DELETE /api/jobs/:id (admin)
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await Job.findByPk(id);
  if (!job) return notFound(res, "Job not found");

  await job.destroy();
  return ok(res, { id }, "Job deleted");
});


// PATCH /api/jobs/:id/featured (admin)
const updateFeatured = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const parsed = updateFeaturedSchema.safeParse(req.body);
  if (!parsed.success) {
    return badRequest(res, "Validation error", parsed.error.flatten());
  }

  const job = await Job.findByPk(id);
  if (!job) return notFound(res, "Job not found");

  job.is_featured = parsed.data.is_featured;
  await job.save();

  return ok(res, job, "Job updated");
});

module.exports = {
  listJobs,
  getJobById,
  createJob,
  deleteJob,
  updateFeatured,
};