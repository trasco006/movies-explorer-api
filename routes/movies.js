const router = require('express').Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');

router.get('/movies', auth, getMovies);
router.post('/movies', auth, createMovie);
router.delete('/movies/:movieId', auth, deleteMovie);

module.exports = router;
