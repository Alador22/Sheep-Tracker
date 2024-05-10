//Alador
/**
 * det er her all logikken for sauerelatert interaksjon skjer.
 * Jeg importerte både "User" og "Sheep" modellen og mongoose-biblioteket for å samhandle med disse collections,
 * "HttpError" for feilhåndtering
 */
const Sheep = require("../models/sheep");
const User = require("../models/user");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

//dette er logikken for å få en liste over sauer
const getSheeps = async (req, res, next) => {
  const ownerId = req.userData.userId;
  let sheeps;
  try {
    // gjør et synkront søk etter sauer med en owner_id som er lik userId for å returnere en liste over sauer som tilhører brukeren
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

//logikk for å få informasjon om en enkelt sau
const getSheepByMerkeNr = async (req, res, next) => {
  const merkeNr = req.params.sheepId;
  const ownerId = req.userData.userId;

  let sheep;
  try {
    //for å finne en sau, søker den etter en sau med owner_id til brukeren og øre merkeNr som samsvarer
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
  //sender sauedataene til den ene sauen
  res.json({ sheep: sheep.toObject({ getters: true }) });
};

//logikk for å legge til en sau
const addSheep = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Ugyldige inndata, vennligst prøv igjen.", 422));
  }
  const ownerId = req.userData.userId;
  const { name, birthdate, merkeNr, klaveNr, dead, father, mother } = req.body;

  //sjekker om det allerede finnes en sau med samme øre merkeNr
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

  //flere kontroller for å se om far og mor-feltet har en gyldig verdi angitt
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

  //bruker Sheep mongoose-modellen for å opprette en ny sau
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

//logikk for oppdatering av sau informasjon
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

  //flere kontroller for å se om far og mor feltet har en gyldig verdi angitt
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
        "Ugyldige inndata, sauen kan ikke bruke samme merkeNr som far eller mor .",
        422
      )
    );
  }

  //hvis verdiene er lovlige, blir de tildelt de riktige feltene
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

//logikk for å fjerne en sau
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

  const parentMerkeNr = sheep.merkeNr;

  //målet her er å fjerne en sau og alle referanser til sauen i andre sau documents.
  // så jeg bruker en økt for først å slette sau dokumentet og deretter oppdatere hver referanse av denne sauen som mor eller far i andre sau dokumenter til en tom String " "
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    sheep = await Sheep.deleteOne().and([
      { merkeNr: merkeNr },
      { owner_id: ownerId },
    ]);
    await Sheep.updateMany(
      { father: parentMerkeNr, owner_id: ownerId },
      { $unset: { father: "" } },
      { session: session }
    );
    await Sheep.updateMany(
      { mother: parentMerkeNr, owner_id: ownerId },
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
