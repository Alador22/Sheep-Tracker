const express = require("express");
const { check } = require("express-validator");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.get("/", sheepControllers.getSheeps);

router.get("/:sheepId", sheepControllers.getSheepById);

router.post(
  "/save",
  [check("name").trim().notEmpty(), check("merkeNr").trim().notEmpty()],
  sheepControllers.addSheep
);

router.patch(
  "/:sheepId",
  [check("name").trim().notEmpty()],
  sheepControllers.updateInfo
);

router.delete("/:sheepId", sheepControllers.removeSheep);

module.exports = router;
