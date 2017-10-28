const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const passport = require('passport');
const sql = require('mssql');
const helpers = require('./helpers');
const session = require('express-session');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static('public'));

app.use(require('cookie-parser')());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.currentPath = req.path;
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', routes);

require('./core/passport')(passport);

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
