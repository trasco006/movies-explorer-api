const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { UnauthorizedError } = require('../middlewares/errors');
require('dotenv').config();
const { NotFoundError, BadRequestError, ConflictError } = require('../middlewares/errors');

const getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const { body } = req;
  User.findByIdAndUpdate({ _id: req.user._id }, { name: body.name, email: body.email },
    {
      new: true,
      runValidators: true,
    })
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Ошибка в запросе'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Ошибка в запросе'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  res.send(process.env.JWT_SECRET)
  //
  // const { email, password } = req.body;
  // return User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     if (!user) {
  //       throw new UnauthorizedError('Неправильный логин или пароль');
  //     } else {
  //       const token = jwt.sign({ _id: user._id }, `${process.env.JWT_SECRET}`, { expiresIn: '7d' });
  //       res.send({ token }, process.env.JWT_SECRET);
  //     }
  //   })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      } else {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => User.create({
            email: req.body.email,
            name: req.body.name,
            password: hash,
          }))
          .then((usr) => {
            if (!usr) {
              throw new ConflictError('Ошибка');
            }
            res.send({
              name: usr.name,
              about: usr.about,
              avatar: usr.avatar,
              id: usr._id,
              email: usr.email,
            });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUser,
  updateUserProfile,
  createUser,
  login,
};
