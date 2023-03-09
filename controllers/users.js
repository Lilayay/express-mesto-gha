const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const ConflictError = require('../errors/ConflictError');
const UnautorizedError = require('../errors/UnautorizedError');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('id пользователя некорректный');
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Этот пользователь уже зарегистрирован');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('Ошибка при заполнении данных пользователя');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('Ошибка при заполнении данных пользователя');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true },)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        throw new BadRequestError('Ошибка при заполнении данных пользователя');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, '5cdd183194489560b0e6bfaf8a81541e', { expiresIn: '7d' });
      res.status(200).send({ _id: token, message: 'Регистрация прошла успешно' });
    })
    .catch((err) => {
      if (err.statusCode === 401) {
        throw new UnautorizedError('Такого пользователя не существует');
      } else if (err.statusCode === 500) {
        throw new InternalServerError('На сервере произошла ошибка');
      } else {
        next(err);
      }
    });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Такого пользователя не существует'));
      }
      return res.send({ data: user });
    })
    .catch(next);
};
