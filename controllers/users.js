const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorMessages = require('../utils/constants');
const { UnauthorizedError } = require('../middlewares/errors');
require('dotenv').config();
const { NotFoundError, BadRequestError, ConflictError } = require('../middlewares/errors');

const secret = process.env.JWT_SECRET || 'default secret';

const getUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(errorMessages.undefinedUser);
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequest));
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
      throw new NotFoundError(errorMessages.undefinedUser);
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(errorMessages.badRequest));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(errorMessages.unauthorized);
      } else {
        const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '7d' });
        res.send(token);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError(errorMessages.conflictEmail);
      } else {
        bcrypt.hash(req.body.password, 10)
          .then((hash) => User.create({
            email: req.body.email,
            name: req.body.name,
            password: hash,
          }))
          .then((usr) => {
            if (!usr) {
              throw new ConflictError(errorMessages.conflictEmail);
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
