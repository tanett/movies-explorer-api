const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const NotValid = require('../errors/not-valid-data');
const NotAuth = require('../errors/not-auth');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })

    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValid('Невалидные данные'));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      User.findOne({ _id: user._id }).then((userNoPassword) => res.send({ userNoPassword }));
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('Такой емайл уже зарегестрирован');
        error.statusCode = 409;
        next(error);
      } else if (err.name === 'ValidationError') {
        next(new NotValid('Невалидные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res.send({ token });
    })

    .catch((err) => {
      if (err.message === 'Неправильные почта или пароль') {
        next(new NotAuth(err.message));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  if (!req.body.name || !req.body.email) {
    next(new NotValid('Некорректные данные'));
  }
  User.findByIdAndUpdate(req.user._id,
    { name: req.body.name, email: req.body.email },
    { new: true, runValidators: true })
    .orFail(() => new Error())
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        const error = new Error('Этот емайл уже занят');
        error.statusCode = 409;
        next(error);
      } else if (err.name === 'ValidationError') {
        next(new NotValid(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUser,
  createUser,
  login,
  updateUser,

};
