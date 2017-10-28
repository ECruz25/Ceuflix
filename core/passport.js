const db = require('../core/db');
const Strategy = require('passport-local').Strategy;
const passwordHash = require('password-hash');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.Email);
  });

  passport.deserializeUser((email, done) => {
    db.executeSql(
      `SELECT * FROM [User] WHERE [User].Email = '${email}'`,
      user => {
        done(null, user.recordset[0]);
      }
    );
  });

  passport.use(
    'local-login',
    new Strategy(
      {
        usernameField: 'email'
      },
      (username, password, done) => {
        db.executeSql(
          `SELECT * FROM [User] WHERE [User].Email = '${username}'`,
          data => {
            if (!data.recordset) {
              return done(null, false);
            }
            if (
              passwordHash.verify(password, data.recordset[0].Password) ||
              password === data.recordset[0].Password
            ) {
              return done(null, data.recordset[0]);
            }
            return done(null, false);
          }
        );
      }
    )
  );
};
