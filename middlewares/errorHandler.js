const { CelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CelebrateError) {
    return res.status(400).send(err.details.get('body'));
  }
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  next();
  return res.status(500).send(
    {
      message: err.message,
    },
  );
};

module.exports = errorHandler;
