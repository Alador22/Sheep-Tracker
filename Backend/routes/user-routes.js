//Alador
/**
 * her er rutene for brukeren. Jeg importerte express-validator slik at vi kan allerede sjekke om verdiene er lovlige i ruten f.eks: " check("password").trim().isLength({ min: 6 }) " er på minst 6 tegn
 * den sendes deretter til det spesifikke rest-api i user-controllers.js filen der hovedlogikken er og forespørselen vil bli behandlet
 * f.eks: " userControllers.signUp " en POST forespørsel for å registrere er sendt til registreringsfunksjonen i user.controllers.js
 *jeg har også importert check-auth som sjekker for tokens som er knyttet til forespørselen og sørger for at den er gyldig
 */

const express = require("express");
const { check } = require("express-validator");
const checkToken = require("../middleware/check-auth");
const userControllers = require("../controllers/users-controllers");

const router = express.Router();

//Route for å få bruker info- brukes ikke*
router.get("/:userId", userControllers.userInfo);

//Route for å registrere en bruker
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

//Route for å logge seg inn
router.post(
  "/login",
  [
    check("email").trim().normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
  ],
  userControllers.logIn
);

router.use(checkToken);
//Route for å endre password
router.patch(
  "/profile",
  [
    check("oldPassword").trim().isLength({ min: 6 }),
    check("newPassword").trim().isLength({ min: 6 }),
  ],
  userControllers.updatePassword
);

//Route for å slette brukeren
router.delete("/profile", userControllers.removeAccount);

module.exports = router;
