const express = require("express");
const { check } = require("express-validator");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.get("/", sheepControllers.getSheeps);

router.get("/:sheepId", sheepControllers.getSheepById);

router.get("/user/:userId", sheepControllers.getSheepByUserId); //not sure here

router.post("/save", sheepControllers.addSheep);

router.patch("/:sheepId", sheepControllers.updateInfo);

router.delete("/:sheepId", sheepControllers.removeSheep);

module.exports = router;
