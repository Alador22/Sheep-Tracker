//Alador
/**
 * det er her all logikken for bruker relatert interaksjon skjer. Jeg importerte både "User" og "Sheep" modellen og mongoose-biblioteket for å samhandle med disse collections,
 * "HttpError" for feilhåndtering, jwt for å lage og sende tokens og "bcrypt" for hashing og verifisering av passord
 */
const User = require("../models/user");
const Sheep = require("../models/sheep");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

//en funksjon som sender brukerinformasjon * ikke i bruk!
const userInfo = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    //gir all bruker informasjon bortsett fra passordet
    user = await User.findById((_id = userId), "-password");
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  if (!user) {
    const error = new HttpError("bruker finnes ikke i databasen.", 404);
    return next(error);
  }
  res.json({ user });
};

//logikken for å opprette en konto
const signUp = async (req, res, next) => {
  //hvis en forespørsel ikke besto route checks. f.eks: passordet er for kort, denne feilen vil bli sendt
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }

  const { firstName, lastName, email, password } = req.body;

  //sjekker om brukeren eksisterer ved å søke etter e-posten i databasen
  let checkExistingUser;
  try {
    checkExistingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "kunne ikke lage konto, prøve igjen senere.",
      500
    );
    return next(error);
  }

  if (checkExistingUser) {
    const error = new HttpError(
      "Brukeren eksisterer allerede, vennligst logg på.",
      422
    );
    return next(error);
  }
  //bruker bcrypt for å hash passordet med 12 salterunder
  let hashedPassword;
  const hashingRounds = 12;
  try {
    hashedPassword = await bcrypt.hash(password, hashingRounds);
  } catch (err) {
    const error = new HttpError(
      "kunne ikke lage konto, prøve igjen senere.",
      500
    );
    return next(error);
  }
  //bruker den importerte User mongoose-modellen for å opprette en ny bruker
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen.", 500);
    return next(error);
  }

  // tar og krypterer brukerdataene til token som skal sendes til front-end
  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
      process.env.TOKEN_KEY,
      {
        //lengden på en Session
        expiresIn: "24h",
      }
    );
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen.", 500);
    return next(error);
  }

  res.status(201).json({ token: token });
};

//logikken for å logge inn
const logIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const { email, password } = req.body;

  //sjekker om brukeren finnes i databasen ved å søke etter e-posten i databasen
  let checkExistingUser;
  try {
    checkExistingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "kunne ikke logge inn, prøve igjen senere.",
      500
    );
    return next(error);
  }

  if (!checkExistingUser) {
    const error = new HttpError(
      "ugyldig e-post eller passord, kunne ikke logge deg på.",
      401
    );
    return next(error);
  }

  //bruker bcrypt for å sjekke om passordet er gyldig
  let validPass = false;
  try {
    validPass = await bcrypt.compare(password, checkExistingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Kunne ikke logge deg på, vennligst prøv igjen.",
      500
    );
    return next(error);
  }

  if (!validPass) {
    const error = new HttpError(
      "ugyldig e-post eller passord, kunne ikke logge deg på.",
      401
    );
    return next(error);
  }

  // tar og krypterer brukerdataene til token som skal sendes til front-end
  let token;
  try {
    token = jwt.sign(
      {
        userId: checkExistingUser.id,
        firstName: checkExistingUser.firstName,
        lastName: checkExistingUser.lastName,
        email: checkExistingUser.email,
      },
      process.env.TOKEN_KEY,
      {
        //lengden på en Session
        expiresIn: "24h",
      }
    );
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen!.", 500);
    return next(error);
  }

  res.status(201).json({ token: token });
};

//Ali* laget det første utkastet til updatePassword og removeAccount. Alador oppdaterte dem deretter til gjeldende tilstand

//logikken for oppdatering av passord
const updatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const { oldPassword, newPassword } = req.body;
  const userId = req.userData.userId;

  let user;
  try {
    user = await User.findById({ _id: userId });
  } catch (err) {
    const error = new HttpError("kunne ikke finne bruker, prøve igjen.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Kunne ikke finne bruker, prøve igjen senere.",
      404
    );
    return next(error);
  }

  //flere kontroller for å se om passordet er gyldig
  let isSamePass = false;
  try {
    isSamePass = await bcrypt.compare(newPassword, user.password);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, vennligst prøv igjen.", 500);
    return next(error);
  }

  if (isSamePass) {
    const error = new HttpError("du har allerede dette som passord!", 401);
    return next(error);
  }

  let validPass = false;
  try {
    validPass = await bcrypt.compare(oldPassword, user.password);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, vennligst prøv igjen.", 500);
    return next(error);
  }

  if (!validPass) {
    const error = new HttpError(
      "Ugyldig inndata, kunne ikke endre passord",
      401
    );
    return next(error);
  }

  //det nye passordet blir kryptert ved hjelp av bcrypt og brukerdataene oppdateres med mongoose for å bruke det nye passordet
  let hashingRounds;
  let password;
  try {
    hashingRounds = 12;
    password = await bcrypt.hash(newPassword, hashingRounds);
    await User.updateOne({ _id: userId }, { password: password });
  } catch (err) {
    const error = new HttpError(
      "Noe gikk galt, vennligst prøv igjen senere.",
      500
    );
    return next(error);
  }

  res.status(201).json({ user: user.toObject({ getters: true }) });
};

//logikk for å slette/fjerne en konto
const removeAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const userId = req.userData.userId;

  let removeAccount;
  try {
    removeAccount = await User.findById({ _id: userId });
  } catch (err) {
    const error = new HttpError("kunne ikke finne bruker, prøve igjen.", 500);
    return next(error);
  }

  if (!removeAccount) {
    const error = new HttpError(
      "Kunne ikke finne bruker, prøve igjen senere.",
      404
    );
    return next(error);
  }

  // målet er å fjerne kontoen og alle sauene knyttet til kontoen fra Sau collection.
  // så jeg oppretter en økt der begge kan gjøres, og hvis den ene mislyktes, ville den avslutte økten og avbryte prosessen
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    removeAccount = await User.deleteOne({ _id: userId });
    await Sheep.deleteMany({ owner_id: userId });
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  res.status(200).json("burker er fjernet!");
};

exports.userInfo = userInfo;
exports.signUp = signUp;
exports.logIn = logIn;
exports.updatePassword = updatePassword;
exports.removeAccount = removeAccount;
