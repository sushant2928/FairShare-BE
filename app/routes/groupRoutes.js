const express = require("express");
const {
  createGroup,
  getGroups,
  addUserToGroup,
  getGroup,
  getGroupExpenses,
  getGroupMembers,
  deleteGroup,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:groupId", getGroup);
router.delete("/:groupId", deleteGroup);
router.get("/:groupId/expenses", getGroupExpenses);
router.get("/:groupId/members", getGroupMembers);
router.post("/add-user", addUserToGroup);

module.exports = router;
