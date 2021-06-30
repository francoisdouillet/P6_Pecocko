const Sauce = require("../models/Sauces");

const fs = require("fs");

// Création d'une sauce
exports.createOneSauce = (req, res, _) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce créée." });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupération de toutes les sauces
exports.getAllSauce = (req, res, _) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupération d'une seule sauce
exports.getOneSauce = (req, res, _) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Modifier une sauce
exports.modifyOneSauce = (req, res, _) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée." }))
    .catch((error) => res.status(400).json({ error }));
};

// Aimer ou ne pas aimer une sauce
exports.rateOneSauce = (req, res, _) => {
  switch (req.body.like) {
    case 0: // Cas ou l'utilisateur annule son j'aime ou son j'aime pas
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { liked: -1 },
                $pull: { usersLiked: req.body.userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré." });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
          if (sauce.usersDisliked.find((user) => user === req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { disliked: -1 },
                $pull: { usersDisliked: req.body.userId },
              }
            )
              .then(() => {
                res.status(201).json({ message: "Vote enregistré." });
              })
              .catch((error) => {
                res.status(400).json({ error });
              });
          }
        })
        .catch((error) => {
          res.status(404).json({ error });
        });
      break;

    case 1: // Cas ou l'utilisateur aime la sauce
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { liked: 1 },
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() => {
          res.status(201).json({ message: "Vote enregistré." });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;

    case -1: // Cas ou l'utilisateur n'aime pas la sauce
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { disliked: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
        .then(() => {
          res.status(201).json({ message: "Vote enregistré." });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
      break;
    default:
      console.error("bad request");
  }
};
