const express = require("express");
const { check } = require("express-validator");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.get("/", sheepControllers.getSheeps);

router.post("/save", sheepControllers.addSheep);

router.patch("/update", sheepControllers.updateInfo);

router.delete("/delete", sheepControllers.removeSheep);

module.exports = router;
