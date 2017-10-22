const sqlDb = require('mssql');

const dbConfig = {
  server: 'localhost\\EDWINSERVER2',
  database: 'Ceuflix',
  user: 'sa',
  password: 'edwin',
  port: 1443
};

// exports.executeSql = (sql, callback) => {
//   const conn = new sqlDb.ConnectionPool(dbConfig);
//   conn
//     .connect()
//     .then(() => {
//       const request = new sqlDb.Request(conn);
//       request
//         .query(sql)
//         .then(recordset => {
//           callback(recordset);
//         })
//         .catch(err => {
//           console.log(err);
//           callback(null, err);
//         });
//     })
//     .catch(err => {
//       console.log(err);
//       callback(null, err);
//     });
// };

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
