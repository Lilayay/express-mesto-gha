const User = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../constants/errors');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => {
      if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(BAD_REQUEST).send({ message: 'Такого пользователя не существует' }));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({ message: 'Ошибка при заполнении данных пользователя' }));
      }
      else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      }
      else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({ message: 'Ошибка при заполнении данных пользователя' }));
      }
      else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      }
      else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(BAD_REQUEST).send({ message: 'Ошибка при изменении аватара' }));
      }
      else if (err.name === 'InternalServerError') {
        next(res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
      }
      else {
        next(err);
      }
    });
};