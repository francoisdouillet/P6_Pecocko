const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const path = require("path");
const app = express();


// Connection au service MangoDB
require('dotenv').config();


mongoose.connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Rend la requête exploitable
app.use(bodyParser.json());

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);

app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

// Mise en place des cookies
var session = require('cookie-session');
var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 heures
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: { secure: true,
            httpOnly: true,
            expires: expiryDate
          }
  })
);

// Mise en place de Helmet, qui permet de protéger l'application de plusieurs vulnérabilitées
var helmet = require('helmet');
app.use(helmet());

module.exports = app;