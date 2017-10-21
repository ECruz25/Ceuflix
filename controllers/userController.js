const sql = require('mssql');

const dbConfig = {
  server: 'localhost\\EDWINSERVER2',
  database: 'Ceuflix',
  user: 'sa',
  password: 'edwin',
  port: 1443
};

exports.getUsers = async (req, res) => {
  const conn = new sql.ConnectionPool(dbConfig);
  const request = new sql.Request(conn);
  conn.connect(function(err) {
    if (err) {
      console.log(err);
      return;
    }
    request.query('SELECT * from [User]', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        res.render('users', { title: 'Users', users: data.recordset });
      }
      conn.close();
    });
  });
};
