//Alador
/**
 *det er her tokens mottas og autentiseres i alle nødvendige ruter ved å bruke jsonwebtoken-biblioteket
 *
 */
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    //strukturen til token kommer inn som "Bearer" + token, så jeg deler den og bruker token-delen her
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Autentisering mislyktes!");
    }
    //"decodes" deretter tokenet ved å bruke jwt.verify og TOKEN_KEY som er i nodemon.json-filen. dataene inne i token brukes deretter i controller.js-filene
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    req.userData = {
      userId: decodedToken.userId,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
      email: decodedToken.email,
    };
    next();
  } catch (err) {
    const error = new HttpError("Autentisering mislyktes!", 403);
    return next(error);
  }
};
