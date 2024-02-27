const express = require("express");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.get("/", sheepControllers.getAllSheeps);

router.post("/save", sheepControllers.addSheep);

router.patch("/update", sheepControllers.updateSheepInfo);

router.delete("/delete", sheepControllers.removeSheep);

module.exports = router;
