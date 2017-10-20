const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const passport = require('passport');

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static('public'));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', routes);

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
