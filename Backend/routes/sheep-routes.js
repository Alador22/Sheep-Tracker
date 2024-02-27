const express = require("express");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.get("/", sheepControllers.getAllSheeps);

router.post("/", sheepControllers.addSheep);

router.patch("/", sheepControllers.updateSheepInfo);

router.delete("/", sheepControllers.removeSheep);

module.exports = router;
