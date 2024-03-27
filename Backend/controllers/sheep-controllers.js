const Sheep = require("../models/sheep");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const getSheeps = async (req, res, next) => {
  let sheeps;
  try {
    sheeps = await Sheep.find();
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

const getSheepById = async (req, res, next) => {
  const sheepId = req.params.sheepId;

  let sheep;
  try {
    sheep = await Sheep.findById(sheepId);
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
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

  const { name, birthYear, merkeNr, klaveNr, dead, father, mother, owner_id } =
    req.body;

  let duplicateChecker = await Sheep.findOne({ merkeNr: merkeNr });
  if (duplicateChecker) {
    const error = new HttpError(
      "En sau med samme merke nummer finnes allerede, prøv igjen med et annet merke nummer.",
      409
    );
    return next(error);
  }

  let fatherSheep;
  if (father) {
    fatherSheep = await Sheep.findOne({ merkeNr: father });
    if (!fatherSheep) {
      return next(
        new HttpError("Kunne ikke finne faren med angitt merkeNr.", 404)
      );
    }
  }
  let motherSheep;
  if (mother) {
    motherSheep = await Sheep.findOne({ merkeNr: mother });
    if (!motherSheep) {
      return next(
        new HttpError("Kunne ikke finne moren med angitt merkeNr.", 404)
      );
    }
  }

  const newSheep = new Sheep({
    name,
    birthYear,
    merkeNr,
    klaveNr,
    dead,
    father,
    mother,
    owner_id,
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
  const sheepId = req.params.sheepId;

  const { name, birthYear, klaveNr, dead, father, mother } = req.body;

  let sheep;
  try {
    sheep = await Sheep.findOne({ _id: sheepId });
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
    fatherSheep = await Sheep.findOne({ merkeNr: father });
    if (!fatherSheep) {
      return next(
        new HttpError("Kunne ikke finne faren med angitt merkeNr.", 404)
      );
    }
  }
  let motherSheep;
  if (mother) {
    motherSheep = await Sheep.findOne({ merkeNr: mother });
    if (!motherSheep) {
      return next(
        new HttpError("Kunne ikke finne moren med angitt merkeNr.", 404)
      );
    }
  }

  if (mother === father) {
    return next(
      new HttpError(
        "Ugyldige inndata, kan ikke bruke samme merkeNr på far og mor.",
        422
      )
    );
  }

  if (father === sheep.merkeNr || mother === sheep.merkeNr) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }

  sheep.name = name;
  sheep.birthYear = birthYear;
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

  const sheepId = req.params.sheepId;

  let sheep;
  try {
    sheep = await Sheep.findById(sheepId);
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

  const merkeNr = sheep.merkeNr;

  try {
    await Sheep.deleteOne({ _id: sheepId });
    await Sheep.updateMany({ father: merkeNr }, { $unset: { father: "" } });
    await Sheep.updateMany({ mother: merkeNr }, { $unset: { mother: "" } });
  } catch (err) {
    const error = new HttpError("Noe gikk galt, prøve igjen senere.", 500);
    return next(error);
  }
  res.status(200).json("Sauen er fjernet!");
};

exports.getSheeps = getSheeps;
exports.getSheepById = getSheepById;
exports.addSheep = addSheep;
exports.updateInfo = updateInfo;
exports.removeSheep = removeSheep;
