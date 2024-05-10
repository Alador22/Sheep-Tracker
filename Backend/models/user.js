//Alador
/**
 *Jeg laget dette skjemaet for brukerdataene ved å bruke mongoose-biblioteket. her definerte jeg alle datatypene og styrke hvordan brukerdataene skal struktureres
 */
const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
});

userSchema.plugin(uniqueValidator);

//her lager vi en collection i mongoDB som skal kalles user
module.exports = mongoose.model("User", userSchema);
