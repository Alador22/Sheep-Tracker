const User = require("../models/user");
const HttpError = require("../models/http-error");

const { validationResult } = require("express-validator");

const userInfo = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById((_id = userId));
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

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const { firstName, lastName, email, password } = req.body;

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

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    sheeps: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen.", 500);
    return next(error);
  }
  res.status(201).json({ User: newUser.toObject({ getters: true }) });
};

const logIn = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const { email, password } = req.body;

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

  if (!checkExistingUser || checkExistingUser.password !== password) {
    const error = new HttpError(
      "ugyldig e-post eller passord, kunne ikke logge deg på.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

const updatePassword = async (req, res, next) => {};

const removeAccount = async (req, res, next) => {};

exports.userInfo = userInfo;
exports.signUp = signUp;
exports.logIn = logIn;
exports.updatePassword = updatePassword;
exports.removeAccount = removeAccount;
