const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточки не найдены');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      _id: card._id,
    }))
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('Ошибка при заполнении данных карточки');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw next(new NotFoundError('Такой карточки не существует'));
      } if (card.owner.valueOf() !== owner) {
        throw next(new OwnerError('id карточки некорректный'));
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        throw next(new NotFoundError('id карточки некорректный'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('id карточки некорректный');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('id карточки некорректный');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};
