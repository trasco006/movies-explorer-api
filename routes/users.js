const router = require('express').Router();
const {
  getUser, updateUserProfile,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const updateProfileValidation = require('../middlewares/validators/user');

router.get('/users/me', auth, getUser);
router.patch('/users/me', auth, updateProfileValidation, updateUserProfile);

module.exports = router;
