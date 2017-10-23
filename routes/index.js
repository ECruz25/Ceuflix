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
router.get('/video', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'video/mp4' });
  const video = fs.createReadStream('./public/video.mp4');
  video.pipe(res);
});

module.exports = router;
