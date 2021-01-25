const articlesRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getArticles, createArticle, deleteArticleById,
} = require('../controllers/article');

articlesRoutes.get('/articles', getArticles);

articlesRoutes.post('/articles', celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2),
    keyWord: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().pattern(/https?:\W\W[\w./-]+\.[\w/]+/).required(),
    image: Joi.string().pattern(/https?:\W\W[\w./-]+\.[\w/]+/).required(),
  }),
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), createArticle);

articlesRoutes.delete('/articles/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex(),
  }),
}), deleteArticleById);

module.exports = articlesRoutes;
