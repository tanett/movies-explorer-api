const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const userRouter = require('./users');
const cardRouter = require('./movies');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, cardRouter);
router.use('*', auth, (req, res, next) => {
  Promise.reject(new NotFoundError('Страница не найдена'))
    .catch(next);
});

module.exports = router;
