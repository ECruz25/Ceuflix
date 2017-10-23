const express = require('express');
const userController = require('../controllers/userController');
const movieController = require('../controllers/movieController');
const serieController = require('../controllers/serieController');
const fs = require('fs');

const router = express.Router();

router.get('/', movieController.getMovies);
router.get('/testing', (req, res) => {
  res.render('index');
});
router.get('/Users', userController.getUsers);
router.get('/User/:id', userController.getUser);
router.get('/AddUser', userController.addUser);
router.post(
  '/AddUser',
  userController.upload,
  userController.resize,
  userController.createUser
);
router.get('/AddMovie', movieController.addMovie);
router.post(
  '/AddMovie',
  movieController.upload,
  movieController.configureMovie,
  movieController.createMovie
);

router.get('/watch/:videoId', movieController.renderVideo);

module.exports = router;
