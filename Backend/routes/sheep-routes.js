//Alador
/**
 * her er rutene for samhandling med sauedataene. Jeg importerte express-validator slik at vi kan allerede sjekke om verdiene er lovlige i ruten
 * den blir sendt deretter til det spesifikke rest-api i sheep-controllers.js filen der hovedlogikken er og forespørselen vil bli behandlet
 * f.eks: " sheepControllers.addSheep " en POST-forespørsel om å legge til en ny sau vil bli sendt til addSheep-funksjonen i sheep-controllers.js
 *jeg har også importert check-auth som sjekker for tokens som er knyttet til forespørselen og sørger for at den er gyldig
 */
const express = require("express");
const { check } = require("express-validator");
const checkToken = require("../middleware/check-auth");

const sheepControllers = require("../controllers/sheep-controllers");

const router = express.Router();

router.use(checkToken);

//Route for å få en liste av alle sauer for en bruker
router.get("/", sheepControllers.getSheeps);

//Route for å få info om en sau
router.get("/:sheepId", sheepControllers.getSheepByMerkeNr);

//Route for å registrere en sau
router.post(
  "/save",
  [check("name").trim().notEmpty(), check("merkeNr").trim().notEmpty()],
  sheepControllers.addSheep
);

//Route for å endre sau info
router.patch(
  "/:sheepId",
  [check("name").trim().notEmpty()],
  sheepControllers.updateInfo
);

//Route for å fjerne en sau
router.delete("/:sheepId", sheepControllers.removeSheep);

module.exports = router;
