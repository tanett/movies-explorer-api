require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors, celebrate, Joi } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/users');
const router = require('./routes/routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/savefilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: [
    'https://films.shadrina.nomoredomains.icu',
    'http://films.shadrina.nomoredomains.icu',
    'https://api.films.shadrina.nomoredomains.icu',
    'https://api.films.shadrina.nomoredomains.icu',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowHeaders: ['Origin', 'X-requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.use(router);

app.use(errorLogger);

/* eslint-disable  no-unused-vars */
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  /* eslint-disable  no-console */
  console.log('App start');
});
