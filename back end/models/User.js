const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

// Le modéle de l'utilisateur, avec le module "mongoose-unique-validator" pour qu'il ne puisse pas creer plusieurs comptes
// avec une même adresse mail
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
