const express = require("express");
const { Blogs, User } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { sendMailServices } = require("../email/sendMail");

const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    const blogs = await Blogs.findAll();
    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get(`/user`, authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogs = await Blogs.findAll({ where: { userId } });
    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.post(`/`, authenticateToken, async (req, res) => {
  const { company, review, rating, salary, rounds, role } = req.body;
  const userId = req.user.userId;
  try {
    const safeRounds = rounds ?? [];
    const createdBlog = await Blogs.create({
      userId,
      company,
      review,
      rating,
      salary,
      rounds: safeRounds,
      role,
    });
    const blogObj = createdBlog.toJSON ? createdBlog.toJSON() : createdBlog;
    res
      .status(201)
      .json({ message: "Review created successfully", blog: blogObj });
    (async () => {
      try {
        const user = await User.findOne({ where: { id: userId } });
        if (user?.email) {
          await sendMailServices(
            user.email,
            "New Review Added",
            `You added a review for ${company} \n\n The further details of the review you added are: \n\n Role: ${role} \n\n Salary: ${salary} \n\n Rating: ${rating} \n\n Review: ${review} \n\n Rounds: ${
              Array.isArray(safeRounds) ? safeRounds.join(", ") : safeRounds
            }`
          );
        } else {
          console.warn(`No email found for user id ${userId}; skipping mail.`);
        }
      } catch (mailErr) {
        console.error("sendMailServices failed (non-fatal):", mailErr);
      }
    })();
  } catch (error) {
    console.error("Create blog failed:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get(`/:id`, authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const blogs = await Blogs.findAll({ where: { userId } });
    return res.status(200).json({ blogs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete(`/:id`, authenticateToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    await Blogs.destroy({ where: { id: blogId } });
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;