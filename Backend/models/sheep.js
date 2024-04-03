const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const sheepSchema = new Schema({
  name: { type: String, required: true },
  birthdate: { type: Date },
  merkeNr: { type: String, required: true },
  klaveNr: { type: Number },
  dead: { type: Date },
  father: { type: String, ref: "Sheep" },
  mother: { type: String, ref: "Sheep" },
  owner_id: { type: mongoose.Types.ObjectId, ref: "User" },
});

sheepSchema.index({ merkeNr: 1, owner_id: 1 }, { unique: true });
sheepSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Sheep", sheepSchema);
