const express = require("express");
const bodyparser = require("body-parser");

const getSheeps = (req, res, next) => {
  return res.status(234).send("here is a list of sheeps");
};

const addSheep = (req, res, next) => {};

const updateInfo = (req, res, next) => {};

const removeSheep = (req, res, next) => {};

exports.getSheeps = getSheeps;
exports.addSheep = addSheep;
exports.updateInfo = updateInfo;
exports.removeSheep = removeSheep;
