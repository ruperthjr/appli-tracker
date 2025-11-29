const express = require("express");
const { Job, User } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { sendMailServices } = require("../email/sendMail");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const userEmail = req.user.email;
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobs = await Job.findAll({ where: { userId: user.id } });
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("GET /users/jobs error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
});

router.post(`/`, authenticateToken, async (req, res) => {
  const {
    jobtitle,
    company,
    location,
    jobtype,
    salary,
    description,
    date,
    rounds,
    review,
  } = req.body;
  const userId = req.user.userId;
  try {
    const roundStatus = (rounds || []).reduce((acc, round) => {
      acc[round] = "0";
      return acc;
    }, {});
    const createdJob = await Job.create({
      userId,
      jobtitle,
      company,
      location,
      jobtype,
      salary,
      description,
      date,
      review,
      roundStatus,
    });
    const jobObj = createdJob.toJSON ? createdJob.toJSON() : createdJob;
    res.status(201).json({ message: "Job created successfully", job: jobObj });
    (async () => {
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (user?.email) {
          const info = await sendMailServices(
            user.email,
            "Job Added",
            `You added a job at ${company} as ${jobtitle} \n\n The further details: \n\n Location: ${location} \n\n Job Type: ${jobtype} \n\n Salary: ${salary} \n\n Description: ${description} \n\n Date of Application: ${date}`
          );
          console.log(info);
        } else {
          console.warn(`No email found for user id ${userId}; skipping mail.`);
        }
      } catch (mailErr) {
        console.error("sendMailServices failed (non-fatal):", mailErr);
      }
    })();
  } catch (error) {
    console.error("Create job failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/", authenticateToken, async (req, res) => {
  const { jobId, round, status, ...otherFields } = req.body;
  try {
    const job = await Job.findOne({
      where: { id: jobId, userId: req.user.userId },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to edit it.",
      });
    }
    if (round !== undefined && status !== undefined) {
      let roundStatus = job.roundStatus || {};
      roundStatus = {
        ...roundStatus,
        [round]: status === "1" || status === 1 ? 1 : 0,
      };
      job.roundStatus = roundStatus;
    }
    const editableFields = [
      "review",
      "jobtitle",
      "company",
      "salary",
      "location",
      "description",
    ];
    editableFields.forEach((field) => {
      if (otherFields[field] !== undefined) {
        job[field] = otherFields[field];
      }
    });
    await job.save();
    return res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete(`/`, authenticateToken, async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await Job.findOne({
      where: { id: jobId, userId: req.user.userId },
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found or you don't have permission to delete it.",
      });
    }
    await job.destroy();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;