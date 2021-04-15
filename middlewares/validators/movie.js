const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const createMovieValidation = celebrate({
  body: {
    country: Joi.string().min(2).max(500).messages({
      'string.min': 'Минимальная длина названия страны 2 символа',
      'string.max': 'Максимальная длина названия страны 500 символов',
      'any.required': 'Обязательное поле',
    }),
    director: Joi.string().min(2).max(130).messages({
      'string.min': 'Минимальная длина имени 2 символа',
      'string.max': 'Максимальная длина имени 130 символов',
      'any.required': 'Обязательное поле',
    }),
    duration: Joi.number().min(1).max(360).messages({
      'string.min': 'Минимальная длительность 1 минута',
      'string.max': 'Максимальная длительность 999 минут',
      'any.required': 'Обязательное поле',
    }),
    year: Joi.string().min(1).max(4).messages({
      'string.min': 'Минимальная длина 2 символа',
      'string.max': 'Максимальная длина 4 символов',
      'any.required': 'Обязательное поле',
    }),
    description: Joi.string().min(2).max(4000).messages({
      'string.min': 'Минимальная длина 2 символа',
      'string.max': 'Максимальная длина 4000 символов',
      'any.required': 'Обязательное поле',
    }),
    image: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Не валидная ссылка');
    }),
    trailer: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Не валидная ссылка');
    }),
    thumbnail: Joi.string().required().custom((value, helper) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helper.message('Не валидная ссылка');
    }),
    nameRU: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина имени 2 символа',
      'string.max': 'Максимальная длина имени 30 символов',
      'any.required': 'Обязательное поле',
    }),
    nameEN: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина имени 2 символа',
      'string.max': 'Максимальная длина имени 30 символов',
      'any.required': 'Обязательное поле',
    })
      .message({
        'any.required': 'Обязательное поле',
      }),
  },
});

module.exports = createMovieValidation;
