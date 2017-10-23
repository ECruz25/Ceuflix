const sqlDb = require('mssql');

const dbConfig = {
  server: 'localhost\\EDWINSERVER2',
  database: 'Ceuflix',
  user: 'sa',
  password: 'edwin',
  port: 1443
};

exports.executeSql = async (sqlQuery, callback) => {
  try {
    const conn = new sqlDb.ConnectionPool(dbConfig);
    await conn.connect();
    const request = new sqlDb.Request(conn);
    const recordset = await request.query(sqlQuery);
    callback(recordset);
  } catch (err) {
    console.log('There was an error');
    console.log(err);
  }
};
