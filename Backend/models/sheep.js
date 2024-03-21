const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const sheepSchema = new Schema({
  name: { type: String, required: true },
  birthYear: { type: Number },
  merkeNr: { type: String, required: true, unique: true },
  klaveNr: { type: Number },
  dead: { type: Date },
  father: { type: String, ref: "Sheep" },
  mother: { type: String, ref: "Sheep" },
  owner_id: { type: mongoose.Types.ObjectId, ref: "User" },
});

sheepSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Sheep", sheepSchema);
