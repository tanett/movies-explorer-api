require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { apiLimiter } = require('./middlewares/rateLimit');

const router = require('./routes/routes');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, URIDB = 'mongodb://localhost:27017/savefilmsdb' } = process.env;

const app = express();

mongoose.connect(URIDB, {
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
    'http://api.films.shadrina.nomoredomains.icu',
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
app.use(apiLimiter);

app.use(router);

app.use(errorLogger);

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
  next();
});

app.listen(PORT, () => {
  /* eslint-disable  no-console */
  console.log('App start');
});
