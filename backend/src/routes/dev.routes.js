const express = require("express");
const { Job } = require("../models");
const { ok } = require("../utils/response");
const { requireAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

// POST /api/dev/seed (admin)
router.post("/seed", requireAdmin, async (_req, res) => {
  const sample = [
    {
      title: "Frontend Engineer",
      company: "Qtec Solution Limited",
      location: "Dhaka",
      category: "Engineering",
      description: "Build modern, responsive UI with Next.js and Tailwind CSS.",
    },
    {
      title: "UI/UX Designer",
      company: "QuickHire",
      location: "Remote",
      category: "Design",
      description: "Create clean and user-friendly interfaces based on Figma.",
    },
  ];

  const created = await Job.bulkCreate(sample);
  return ok(res, created, "Seeded sample jobs");
});

module.exports = router;