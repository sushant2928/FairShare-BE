const express = require("express");
const { register, login, findUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.get("/login", login);
router.post("/find-user", findUser);

module.exports = router;
