const router = require('express').Router();
const {
  getUser, updateUserProfile,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.get('/users/me', auth, getUser);
router.patch('/users/me', auth, updateUserProfile);

module.exports = router;
