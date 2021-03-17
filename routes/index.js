const router = require('express').Router();
const usersRoutes = require('./users.js');
const moviesRoutes = require('./movies.js');

const { NotFoundError } = require('../middlewares/errors');

router.use('/', moviesRoutes);
router.use('/', usersRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});
module.exports = router;
