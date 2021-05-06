const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, 'Поле обязательно'],
    },
    director: {
      type: String,
      required: [true, 'Поле обязательно'],
    },
    duration:  {
      type: Number,
      required: [true, 'Поле обязательно'],
    },
    year:  {
      type: Number,
      required: [true, 'Поле обязательно'],
      validate: {

        validator: (v) => {
          const regexp = /1|2\d{3}/gi;
          return regexp.test(v);
        },
        message: 'Поле "year" должно быть годом в формате ХХХХ и начинаться с 1 или 2',
      },
    },
    description: {
      type: String,
      required: [true, 'Поле обязательно'],
    },
    image: {
      type: String,
      required: [true, 'Поле обязательно'],
      validate: {

        validator: (v) => {
          const regexp = /https?:\/\/\S+#?$/gi;
          return regexp.test(v);
        },
        message: 'Поле "image" должно быть валидной ссылкой на постер',
      },
    },
    trailer: {
      type: String,
      required: [true, 'Поле обязательно'],
      validate: {

        validator: (v) => {
          const regexp = /https?:\/\/\S+#?$/gi;
          return regexp.test(v);
        },
        message: 'Поле "trailer" должно быть валидной ссылкой на трейлер',
      },
    },
    thumbnail: {
      type: String,
      required: [true, 'Поле обязательно'],
      validate: {

        validator: (v) => {
          const regexp = /https?:\/\/\S+#?$/gi;
          return regexp.test(v);
        },
        message: 'Поле "thumbnail" должно быть валидной ссылкой на мини постер',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
      nameRU: {
      type: String,
      required: [true, 'Поле обязательно'],
  },
    nameEN: {
      type: String,
      required: [true, 'Поле обязательно'],
    },}
);

module.exports = mongoose.model('movie', movieSchema);
