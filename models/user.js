const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательно'],
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, 'Поле обязательно'],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Поле "email" должно быть валидным email-адресом',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле обязательно'],
      select: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
