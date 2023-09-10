const JWT = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/unauthorized');
/* --------.env---------*/
require('dotenv').config();

const { NODE_ENV, JWT_SECRET = '29af84f0aad493a9297699fb973aedbeb0f73de1d0d5e7c6d6a290550cf56c10' } = process.env;
/*---------------------*/

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    /* --------.env---------*/
    payload = JWT.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
    /*---------------------*/
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  req.user = payload;

  next();
};

module.exports = { auth };
