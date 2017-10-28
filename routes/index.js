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
router.get(
  '/Register',
  ensureLogin.ensureLoggedIn(),
  userController.registerUser
);
router.post(
  '/Register',
  ensureLogin.ensureLoggedIn(),
  userController.createUser
);
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
router.get('/AddMovie', ensureLogin.ensureLoggedIn(), movieController.addMovie);
router.post(
  '/AddMovie',
  movieController.upload,
  movieController.configureMovie,
  movieController.createMovie
);

router.get(
  '/watch/:videoId',
  ensureLogin.ensureLoggedIn(),
  movieController.renderVideo
);
router.get('/Login', userController.login);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logout);
router.get('/profile', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('users', { user: req.user });
});

module.exports = router;
