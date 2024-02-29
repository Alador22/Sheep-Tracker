const express = require("express");

const userControllers = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", userControllers.userInfo);

router.post("/signup", userControllers.signUp);

router.post("/login", userControllers.logIn);

router.patch("/update", userControllers.updatePassword);

router.delete("/remove", userControllers.removeAccount);

module.exports = router;
