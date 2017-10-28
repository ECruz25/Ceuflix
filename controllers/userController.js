const express = require('express');
const fs = require('fs');
const passport = require('passport');
const passwordHash = require('password-hash');
const ensureLogin = require('connect-ensure-login');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const db = require('../core/db');
const router = express.Router();
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not supported' }, false);
    }
  }
};

exports.registerUser = (req, res) => {
  res.render('register');
  res.end();
};

exports.getUsers = (req, res) => {
  db.executeSql('SELECT * from [User]', data => {
    res.render('users', { title: 'Users', users: data.recordset });
    res.end();
  });
};

exports.getUser = (req, res) => {
  db.executeSql(
    `SELECT * FROM [User] WHERE [User].Email = '${req.params.email}'`,
    data => {
      res.render('users', { title: 'Users', users: data.recordset });
      res.end();
    }
  );
};

exports.addUser = (req, res) => {
  res.render('addUser', { title: 'Add User' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;

  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, 755);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createUser = (req, res) => {
  db.executeSql(
    `INSERT INTO [User] (Email, Password, Name, Photo, SubscriptionID) VALUES
    ('${req.body.email}', '${passwordHash.generate(req.body.password)}', '${req
      .body.name}', '${req.body.photo}', ${req.body.userSubscription})`,
    data => {
      res.redirect('/Users');
      res.end();
    }
  );
};

exports.login = (req, res) => {
  res.render('login');
};

exports.loginUser = passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login'
});

exports.logout = (req, res) => {
  req.logout();
  res.redirect();
};
