const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => header.replace('Bearer ', '');
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  process.env.JWT = extractBearerToken(authorization);
  let JWT_SECRET;
  if (process.env.NODE_ENV !== 'production') {
    JWT_SECRET = 'super-secret-key';
  } else {
    JWT_SECRET = process.env.JWT_SECRET;
  }
  try {
    const user = jwt.verify(process.env.JWT, { JWT_SECRET });
    req.user = user;
  } catch (err) {
    return handleAuthError(res);
  }
  return next(); // пропускаем запрос дальше
};

module.exports = auth;
