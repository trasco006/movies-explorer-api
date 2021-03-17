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
  try {
    const user = jwt.verify(process.env.JWT, `${process.env.JWT_SECRET}`);
    req.user = user;
  } catch (err) {
    return handleAuthError(res);
  }
  return next(); // пропускаем запрос дальше
};

module.exports = auth;
