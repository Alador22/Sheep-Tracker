const express = require("express");
const { check } = require("express-validator");

const userControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/:userId", userControllers.userInfo);

router.post(
  "/signup",
  [
    check("firstName").trim().notEmpty(),
    check("lastName").trim().notEmpty(),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
  ],
  userControllers.signUp
);

router.post(
  "/login",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
  ],
  userControllers.logIn
);

router.patch("/update", userControllers.updatePassword);

router.delete("/remove", userControllers.removeAccount);

module.exports = router;
