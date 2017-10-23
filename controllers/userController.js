const db = require('../core/db');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const passport = require('passport');
const localStrategy = require('passport-local').localStrategy;

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

exports.getUsers = (req, res) => {
  db.executeSql('SELECT * from [User]', data => {
    res.render('users', { title: 'Users', users: data.recordset });
    res.end();
  });
};

exports.getUser = (req, res) => {
  db.executeSql(
    `SELECT * FROM [User] WHERE [User].UserID = ${req.params.id}`,
    data => {
      console.log(req.params.id, data.recordset);
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
  console.log(req.body.userType, req.body.gender);
  db.executeSql(
    `INSERT INTO [User] (UserID, UserName, Role, Gender, Photo) VALUES
    (${req.body.id}, '${req.body.name}', '${req.body.userType}',
      '${req.body.gender}', '${req.body.photo}')`,
    data => {
      res.redirect('/Users');
      res.end();
    }
  );
};
