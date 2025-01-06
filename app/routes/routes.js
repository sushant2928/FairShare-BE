const express = require("express");
const groupRoutes = require("./groupRoutes");
const authRoutes = require("./authRoutes");
const expenseRoutes = require("./expenseRoutes");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();
// Authentication Routes
router.use("/auth", authenticate, authRoutes);

// Group Routes
router.use("/group", authenticate, groupRoutes);

// Expense Routes
router.use("/expense", authenticate, expenseRoutes);

module.exports = router;
