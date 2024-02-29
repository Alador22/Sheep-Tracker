const express = require("express");

const userControllers = require("../controllers/user-controllers");

const router = express.Router();

router.get("/", userControllers.getUserInfo);

router.post("/", userControllers.signUp);

router.post("/", userControllers.logIn);

router.patch("/", userControllers.updatePassword);

router.delete("/", userControllers.removeAccount);

module.exports = router;