const getAllSheeps = (req, res, next) => {
  return res.status(234).send("here is a list of sheeps");
};

const addSheep = (req, res, next) => {};

const updateSheepInfo = (req, res, next) => {};

const removeSheep = (req, res, next) => {};

exports.getAllSheeps = getAllSheeps;
exports.addSheep = addSheep;
exports.updateSheepInfo = updateSheepInfo;
exports.removeSheep = removeSheep;
