const express = require("express");
const {
  listJobs,
  getJobById,
  createJob,
  deleteJob,
} = require("../controllers/jobs.controller");
const { requireAdmin } = require("../middlewares/admin.middleware");

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", getJobById);
router.post("/", requireAdmin, createJob);
router.delete("/:id", requireAdmin, deleteJob);

module.exports = router;