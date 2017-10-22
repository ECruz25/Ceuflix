const express = require('express');
const userController = require('../controllers/userController');
const movieController = require('../controllers/movieController');
const serieController = require('../controllers/serieController');

const router = express.Router();

router.get('/', movieController.getMovies);

router.get('/Users', userController.getUsers);
router.get('/User/:id', userController.getUser);
router.get('/AddUser', userController.addUser);
router.post('/AddUser', userController.createUser);

module.exports = router;
