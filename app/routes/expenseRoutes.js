const express = require("express");
const {
  createExpense,
  addExpense,
  getExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", createExpense);
router.get("/:expenseId", getExpense);
router.post("/add-expense", addExpense);

module.exports = router;
