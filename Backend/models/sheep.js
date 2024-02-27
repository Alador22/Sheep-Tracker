const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const sheepShema = new Schema({
  name: { type: String, required: true },
  birthYear: { type: Number },
  merkeNr: { type: String, required: true, unique: true },
  dead: { type: Date },
  father: { type: mongoose.Types.ObjectId, ref: "Sheep" },
  mother: { type: mongoose.Types.ObjectId, ref: "Sheep" },
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Sheep", sheepShema);
