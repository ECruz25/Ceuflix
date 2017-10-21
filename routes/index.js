const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/Users', userController.getUsers);

router.get('/Movies', (req, res) => {
  res.render('movies', { title: 'Movies' });
});

module.exports = router;
