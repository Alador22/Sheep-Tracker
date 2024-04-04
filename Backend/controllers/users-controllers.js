const User = require("../models/user");
const Sheep = require("../models/sheep");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const userInfo = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
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
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen.", 500);
    return next(error);
  }

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
        expiresIn: "5h",
      }
    );
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen.", 500);
    return next(error);
  }

  res.status(201).json({ token: token });
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
        expiresIn: "5h",
      }
    );
  } catch (err) {
    const error = new HttpError("kunne ikke lage konto, prøve igjen!.", 500);
    return next(error);
  }

  res.status(201).json({ token: token });
};

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

  if (user.password !== oldPassword) {
    const error = new HttpError(
      "ugyldig inndata, kunne ikke endre passord.",
      401
    );
    return next(error);
  }

  if (user.password === newPassword) {
    const error = new HttpError(
      "dette passord eksister allerede, prøv et nytt passord",
      401
    );
    return next(error);
  }

  user.password = newPassword;

  try {
    await User.create(user);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  res.status(201).json({ user: user.toObject({ getters: true }) });
};

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
