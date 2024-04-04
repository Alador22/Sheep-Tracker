const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Autentisering mislyktes!");
    }
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
