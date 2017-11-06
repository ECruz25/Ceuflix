const express = require('express');
const fs = require('fs');
const passport = require('passport');
const passwordHash = require('password-hash');
const ensureLogin = require('connect-ensure-login');
const userController = require('../controllers/userController');
const movieController = require('../controllers/movieController');
const serieController = require('../controllers/serieController');
const db = require('../core/db');
const router = express.Router();

router.get('/', ensureLogin.ensureLoggedIn(), movieController.getMovies);

router.get('/Register', userController.registerUser);
router.post(
  '/Register',
  userController.upload,
  userController.resize,
  userController.register
);

router.get('/Series', (req, res) => {
  res.redirect('/');
});
router.get('/Users', ensureLogin.ensureLoggedIn(), userController.getUsers);
router.get('/User/:id', ensureLogin.ensureLoggedIn(), userController.getUser);
router.get('/AddUser', ensureLogin.ensureLoggedIn(), userController.addUser);
router.post(
  '/AddUser',
  ensureLogin.ensureLoggedIn(),
  userController.upload,
  userController.resize,
  userController.createUser
);
router.get(
  '/AddMovie',
  ensureLogin.ensureLoggedIn(),
  userController.verifyAdmin,
  movieController.addMovie
);
router.post(
  '/AddMovie',
  movieController.upload,
  movieController.configureMovie,
  movieController.createMovie
);
router.get(
  '/watch/:videoId',
  ensureLogin.ensureLoggedIn(),
  movieController.addPlayRecord
);
router.get(
  '/watchNow/:videoId',
  ensureLogin.ensureLoggedIn(),
  movieController.renderVideo
);
router.get(
  '/editMovie/:videoId',
  ensureLogin.ensureLoggedIn(),
  movieController.editMovie
);
router.get('/Login', ensureLogin.ensureNotLoggedIn(), userController.login);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);
router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('users', { user: req.user });
});
router.get('/generateRandomUsers', userController.generateRandomUsers);
router.get('/updateSubscriptionDate', userController.updateSubscriptionDate);
router.get('/generateRandomMovies', movieController.generateRandomMovies);

module.exports = router;
