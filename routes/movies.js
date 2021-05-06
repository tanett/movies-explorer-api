const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({// country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(50),
    director: Joi.string().required().min(2).max(50),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required().min(2).max(150),
    image: Joi.string().required().custom((value, helper) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Некорректный адрес изображения');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Некорректный адрес трейлера');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (isUrl(value, { require_protocol: true })) {
        return value;
      }
      return helper.message('Некорректный адрес изображения');
    }),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24),
  }),
}), deleteMovie);



module.exports = router;
