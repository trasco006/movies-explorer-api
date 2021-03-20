const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const createMovieValidation = require('../middlewares/validators/movie');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, createMovieValidation, createMovie);
router.delete('/movies/:movieId', auth, deleteMovie);

module.exports = router;
