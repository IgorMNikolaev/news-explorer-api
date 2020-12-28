const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login } = require('../controllers/user');
const usersRoutes = require('./users.js');
const articlesRoutes = require('./articles.js');
const NotFoundError = require('../errors/not-found-error');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().trim().required().min(3),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use(auth);
router.use('/', usersRoutes);
router.use('/', articlesRoutes);

router.all('*', () => {
  throw new NotFoundError('Страница не найдена!');
});

module.exports = router;
