const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const NotValid = require('../errors/not-valid-data');

const NotAccess = require('../errors/not-access');

const createMovie = (req, res, next) => {
  const userId = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  // if (!req.body.name || !req.body.link) {
  //   next(new NotValid('Некорректные данные'));
  // }

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: userId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValid('Невалидные данные'));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({}).then((movies) => res.send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId).select('+owner')
    .orFail(() => new NotFoundError('Фильм с указанным ID не найден'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new NotAccess('Вы не можете удалить этот фильм');
      } else {
        return Movie.deleteOne({ _id: movieId })
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValid('Невалидное Id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
