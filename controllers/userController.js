const db = require('../core/db');

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

exports.createUser = (req, res) => {
  console.log(req.body.id, req.body.name);
  db.executeSql(
    `INSERT INTO [User] (UserID, UserName) VALUES (${req.body.id}, '${req.body
      .name}')`,
    data => {
      res.redirect('/Users');
      res.end();
    }
  );
};
