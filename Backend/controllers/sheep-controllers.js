const Sheep = require("../models/sheep");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getSheeps = async (req, res, next) => {
  const ownerId = req.userData.userId;
  let sheeps;
  try {
    sheeps = await Sheep.find({ owner_id: ownerId });
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  if (!sheeps) {
    const error = new HttpError("det finnes ikke noe sauer i databasen.", 404);
    return next(error);
  }
  res.json({ sheeps });
};

const getSheepByMerkeNr = async (req, res, next) => {
  const merkeNr = req.params.sheepId;
  const ownerId = req.userData.userId;

  let sheep;
  try {
    sheep = await Sheep.findOne().and([
      { merkeNr: merkeNr },
      { owner_id: ownerId },
    ]);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere", 500);
    return next(error);
  }
  if (!sheep) {
    const error = new HttpError(
      "Kunne ikke finne en sau for det angitte id.",
      404
    );
    return next(error);
  }
  res.json({ sheep: sheep.toObject({ getters: true }) });
};

const addSheep = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const ownerId = req.userData.userId;
  const { name, birthdate, merkeNr, klaveNr, dead, father, mother } = req.body;

  let dupeChecker = await Sheep.findOne().and([
    { merkeNr: merkeNr },
    { owner_id: ownerId },
  ]);

  if (dupeChecker) {
    const error = new HttpError(
      "En sau med samme merke nummer finnes allerede, prøv igjen med et annet merke nummer.",
      409
    );
    return next(error);
  }

  let fatherSheep;
  if (father) {
    fatherSheep = await Sheep.findOne().and([
      { merkeNr: father },
      { owner_id: ownerId },
    ]);
    if (!fatherSheep) {
      return next(
        new HttpError("Kunne ikke finne faren med angitt merkeNr.", 404)
      );
    }
  }
  let motherSheep;
  if (mother) {
    motherSheep = await Sheep.findOne().and([
      { merkeNr: mother },
      { owner_id: ownerId },
    ]);
    if (!motherSheep) {
      return next(
        new HttpError("Kunne ikke finne moren med angitt merkeNr.", 404)
      );
    }
  }

  if (mother && father && mother === father) {
    return next(
      new HttpError(
        "Ugyldige inndata, kan ikke bruke samme merkeNr på far og mor.",
        422
      )
    );
  }

  const newSheep = new Sheep({
    name,
    birthdate,
    merkeNr,
    klaveNr,
    dead,
    father,
    mother,
    owner_id: ownerId,
  });

  try {
    await newSheep.save();
  } catch (err) {
    const error = new HttpError("kunne ikke lage sauen, prøve igjen.", 500);
    return next(error);
  }

  res.status(201).json({ sheep: newSheep.toObject({ getters: true }) });
};

const updateInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const merkeNr = req.params.sheepId;
  const ownerId = req.userData.userId;
  const { name, birthdate, klaveNr, dead, father, mother } = req.body;

  let sheep;
  try {
    sheep = await Sheep.findOne().and([
      { merkeNr: merkeNr },
      { owner_id: ownerId },
    ]);
  } catch (err) {
    const error = new HttpError("kunne ikke finne sauen, prøve igjen.", 500);
    return next(error);
  }
  if (!sheep) {
    const error = new HttpError(
      "Kunne ikke finne sauen, prøve igjen senere.",
      404
    );
    return next(error);
  }
  let fatherSheep;
  if (father) {
    fatherSheep = await Sheep.findOne().and([
      { merkeNr: father },
      { owner_id: ownerId },
    ]);
    if (!fatherSheep) {
      return next(
        new HttpError("Kunne ikke finne faren med angitt merkeNr.", 404)
      );
    }
  }
  let motherSheep;
  if (mother) {
    motherSheep = await Sheep.findOne().and([
      { merkeNr: mother },
      { owner_id: ownerId },
    ]);
    if (!motherSheep) {
      return next(
        new HttpError("Kunne ikke finne moren med angitt merkeNr.", 404)
      );
    }
  }

  if (mother && father && mother === father) {
    return next(
      new HttpError(
        "Ugyldige inndata, kan ikke bruke samme merkeNr på far og mor.",
        422
      )
    );
  }

  if (father === sheep.merkeNr || mother === sheep.merkeNr) {
    return next(
      new HttpError(
        "Ugyldige inndata, sauen kan ikke bruke merkeNr som far eller mor .",
        422
      )
    );
  }

  sheep.name = name;
  sheep.birthdate = birthdate;
  sheep.klaveNr = klaveNr;
  sheep.dead = dead;
  sheep.father = father;
  sheep.mother = mother;

  try {
    await Sheep.create(sheep);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  res.status(201).json({ sheep: sheep.toObject({ getters: true }) });
};

const removeSheep = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const ownerId = req.userData.userId;
  const merkeNr = req.params.sheepId;

  let sheep;
  try {
    sheep = await Sheep.findOne().and([
      { merkeNr: merkeNr },
      { owner_id: ownerId },
    ]);
  } catch (err) {
    const error = new HttpError("kunne ikke finne sauen, prøve igjen :) ", 500);
    return next(error);
  }

  if (!sheep) {
    const error = new HttpError(
      "Kunne ikke finne en sauen, prøve igjen senere.",
      404
    );
    return next(error);
  }

  const merkeNr1 = sheep.merkeNr;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    sheep = await Sheep.deleteOne().and([
      { merkeNr: merkeNr },
      { owner_id: ownerId },
    ]);
    await Sheep.updateMany(
      { father: merkeNr1, owner_id: ownerId },
      { $unset: { father: "" } },
      { session: session }
    );
    await Sheep.updateMany(
      { mother: merkeNr1, owner_id: ownerId },
      { $unset: { mother: "" } },
      { session: session }
    );
    await session.commitTransaction();
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  res.status(200).json("Sauen er fjernet!");
};

exports.getSheeps = getSheeps;
exports.getSheepByMerkeNr = getSheepByMerkeNr;
exports.addSheep = addSheep;
exports.updateInfo = updateInfo;
exports.removeSheep = removeSheep;
