const Movie = require('../models/movie');
const errorMessages = require('../utils/constants');
const {ConflictError} = require("../middlewares/errors");
const {
  BadRequestError,
  NotFoundError,
} = require('../middlewares/errors');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch((err) => next(err));
};
const createMovie = (req, res, next) => {
  Movie.findOne({nameRU: req.body.nameRU})
    .then(movie=>{
      if (movie){
        throw new ConflictError(errorMessages.conflictEmail);
      } else {
        Movie.create(
          {
            country: req.body.country,
            director: req.body.director,
            duration: req.body.duration,
            year: req.body.year,
            description: req.body.description,
            image: req.body.image,
            trailer: req.body.trailer,
            nameRU: req.body.nameRU,
            nameEN: req.body.nameEN,
            thumbnail: req.body.thumbnail,
            owner: req.user,
            movieId: req.body.movieId,
          },
        )
          .then((movie) => {
            res.status(200).send(movie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              next(new NotFoundError(err));
            } else if (err.name === 'ValidationError') {
              next(new BadRequestError(errorMessages.badRequest));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      next(err);
    });

};
const deleteMovie = (req, res, next) => {
  Movie.findOne({ _id: req.params.movieId })
    .orFail(() => {
      throw new NotFoundError(errorMessages.notFoundFilm);
    })
    .then((item) => {
      if (JSON.stringify(item.owner) !== JSON.stringify(req.user._id)) {
        throw new BadRequestError(errorMessages.notEnoughRights);
      } else {
        Movie.deleteOne({ _id: req.params.movieId })
          .then(res.status(200).send({ message: 'Фильм удален.' }))
          .catch((err) => {
            if (err) {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
