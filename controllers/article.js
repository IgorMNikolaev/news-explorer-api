const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forb-error');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(new NotFoundError('Статьи не найдены'))
    .then((articles) => res.send(articles))
    .catch(next);
};

module.exports.deleteArticleById = (req, res, next) => {
  Article.findById(req.params.id).select('+owner')
    .orFail(new NotFoundError('Статья не найдена'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('Это не ваша Статья!');
      } else {
        Article.findByIdAndRemove(req.params.id)
          .orFail(new NotFoundError('Статья не найдена'))
          .then((cardData) => res.send(cardData))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.createArticle = (req, res) => {
  const {
    keyWord, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyWord, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => article.populate('owner').execPopulate())
    .then((article) => res.send(article));
};
