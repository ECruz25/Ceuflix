const express = require('express');
const fs = require('fs');
const passport = require('passport');
const passwordHash = require('password-hash');
const ensureLogin = require('connect-ensure-login');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const db = require('../core/db');
const moment = require('moment');
const faker = require('faker');

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
  if (req.body.userType === 'Admin') {
    req.body.SubscriptionID = 3;
  }
  console.log(req.body);
  db.executeSql(
    `INSERT INTO [User] (Email, Password, Name, SubscriptionID, Gender, Role) VALUES
    ('${req.body.email}', '${passwordHash.generate('password')}', '${req.body
      .name}', ${req.body.userSubscription}, '${req.body.gender}','${req.body
      .userType}' )`,
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
  res.redirect('/');
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.Role === 'Admin') {
    next(null, true);
  } else {
    res.send(`You don't have the required permissions`);
  }
};

exports.verifyMoviesAccess = (req, res, next) => {
  if (req.user.SubscriptionID === 2) {
    res.send(`Please upgrade your subscription to access to this site. `);
  } else if (req.user.SubscriptionID === 1 || req.user.SubscriptionID === 3) {
    next(null, true);
  }
};

exports.verifySeriesAccess = (req, res, next) => {
  if (req.user.SubscriptionID === 1) {
    res.send(`Please upgrade your subscription to access to this site. `);
  } else if (req.user.SubscriptionID === 2 || req.user.SubscriptionID === 3) {
    next(null, true);
  }
};

exports.register = (req, res) => {
  console.log(req.body);
  console.log(moment().format('YYYY-MM-DD hh:mm:ss'));
  db.executeSql(
    `INSERT INTO [User] (Email, Password, Name, SubscriptionID, Gender, Role, SubscriptionDate, DOB)
    VALUES ('${req.body.email}', '${passwordHash.generate(
      req.body.password
    )}', '${req.body.name}',
    1, '${req.body.gender}','Customer','${moment().format(
      'YYYY-MM-DD hh:mm:ss'
    )}','${req.body.dob}')`,
    data => {
      res.redirect('/Users');
      res.end();
    }
  );
};

generateCode = (amount, date, gender) => {
  for (let x = 0; x < amount; x++) {
    const date1 = new Date(faker.date.between(date, '2010-12-31'));
    const dob1 = `${date1.getFullYear() + 1}-${date1.getMonth() +
      1}-${date1.getDate()}`;
    const subdate1 = new Date(faker.date.between('2016-01-01', '2017-11-09'));
    const subDate2 = `${subdate1.getFullYear() + 1}-${subdate1.getMonth() +
      1}-${subdate1.getDate()} ${subdate1.getHours()}:${subdate1.getMinutes()}:${subdate1.getSeconds()}`;
    db.executeSql(
      `INSERT INTO [User] (Email, Password, Name, SubscriptionID, Gender, Role, SubscriptionDate, DOB)
      VALUES ('${faker.internet.email()}', '${passwordHash.generate(
        'password'
      )}', '${faker.name.findName()}',
      1, '${gender}','Customer','${subDate2}','${dob1}')`,
      data => {
        console.log(`USER-${x} Created`);
      }
    );
  }
};

exports.generateRandomUsers = (req, res) => {
  generateCode(1000, '1980-01-01', 'M');
  generateCode(1000, '1980-01-01', 'F');

  res.send('hello');
};

exports.updateSubscriptionDate = (req, res) => {
  db.executeSql(`SELECT * FROM [User]`, data => {
    console.log(data.recordset);
    for (let x of data.recordset) {
      // console.log(x['Email']);
      const subdate1 = new Date(faker.date.between('2016-01-01', '2017-11-09'));
      const subDate2 = `${date.getFullYear() + 1}-${date.getMonth() +
        1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      db.executeSql(
        `UPDATE [User] SET SubscriptionDate = '${subDate}' WHERE Email = '${x[
          'Email'
        ]}'`,
        data => {
          console.log(`x['Email'] updated`);
        }
      );
    }
    res.send(data.recordset);
  });

  // db.executeSql(
  //   `UPDATE [User] SET SubscriptionDate = ${faker.date.between(
  //     '2016-01-01',
  //     '2017-11-09'
  //   )}`,
  //   data => {
  //     res.send(data.recordset);
  //   }
  // );
};
