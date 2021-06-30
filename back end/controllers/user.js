const User = require("../models/User");

// Permet d'échanger des jetons d'authentification pour la sécurité d'authentification
const jwt = require("jsonwebtoken");

// Permet de crypter le mot de passe de l'utilisateur
const bcrypt = require("bcrypt");

// Permet de crypter l'email
var CryptoJS = require("crypto-js")

// Pour que l'utilisateur s'inscrive
exports.signup = (req, res, next) => {
    //regex pour exiger un mot de passe fort d'au moins 8 caractères
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9\d@$!%*?&]{8,}$/; 
    const password = req.body.password;
    if (password.match(regex)) {
      bcrypt
      .hash(req.body.password, 10) // Permet le hashage du mot de passe
      .then((hash) => {
        const user = new User({
          email: CryptoJS.MD5(req.body.email).toString(),
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
    } else {
      
    }
};

// Pour que l'utilisateur se connecte
exports.login = (req, res, next) => {
  User.findOne({ email: CryptoJS.MD5(req.body.email).toString() })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
