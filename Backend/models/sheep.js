//Alador
/**
 *Jeg laget dette skjemaet for sauedata ved å bruke mongoose-biblioteket. her definerte jeg alle datatypene og styrke hvordan saudataene skal struktureres
 *det er også her koblingen mellom bruker collection og sau collection er definert.
 *Jeg la til et felt kalt owner_id som lagrer IDen til brukeren som eier sauen.
 *jeg la også til en referanse til selve sau collection i far og mor ID-feltet slik at den lagrer IDen til moren og faren til sauen.
 */
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

//denne linjen sørger for at hver bruker kan ha kun 1 sau med samme øre merkenummer. så brukeren kan ikke ha en annen sau med samme merkeNr, men andre brukere har lov til å bruke den med det samme grensen
sheepSchema.index({ merkeNr: 1, owner_id: 1 }, { unique: true });
sheepSchema.plugin(uniqueValidator);
//her lager vi en collection i mongoDB som skal kalles Sheep
module.exports = mongoose.model("Sheep", sheepSchema);
