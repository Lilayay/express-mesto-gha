const Card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточки не найдены' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
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
      if (err.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({ message: 'Ошибка при заполнении данных карточки' }));
      } else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
      }
      return card.remove()
        .then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(BAD_REQUEST).send({ message: 'Неверный идентификатор карточки' }));
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
        return res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(BAD_REQUEST).send({ message: 'Неверный идентификатор карточки' }));
      } else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
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
        return res.status(NOT_FOUND).send({ message: 'Такой карточки не существует' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(BAD_REQUEST).send({ message: 'Неверный идентификатор карточки' }));
      } else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      } else {
        next(err);
      }
    });
};
