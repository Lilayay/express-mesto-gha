const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/UnautorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, '5cdd183194489560b0e6bfaf8a81541e');
  } catch (err) {
    return next(new AuthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};
