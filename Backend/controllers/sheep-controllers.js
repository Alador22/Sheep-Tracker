const express = require("express");
const bodyparser = require("body-parser");

const sheep = require("../models/sheep");

const getSheeps = async (req, res, next) => {
  return res.status(234).send("here is a list of sheeps");
};
const getSheepById = async (req, res, next) => {};

const addSheep = async (req, res, next) => {
  const { name, birthYear, merkeNr, klaveNr, dead, father, mother, owner } =
    req.body;

  const newSheep = new sheep({
    name,
    birthYear,
    merkeNr,
    klaveNr,
    dead,
    father,
    mother,
    owner,
  });

  newSheep.save();

  res.status(201).json({ sheep: newSheep });
};

const updateInfo = async (req, res, next) => {};

const removeSheep = async (req, res, next) => {};

exports.getSheeps = getSheeps;
exports.getSheepById = getSheepById;
exports.addSheep = addSheep;
exports.updateInfo = updateInfo;
exports.removeSheep = removeSheep;
