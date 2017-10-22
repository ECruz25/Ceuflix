const db = require('../core/db');

exports.getSeries = (req, res) => {
  db.executeSql('SELECT * from [User]', (data, err) => {
    if (err) {
    } else {
      res.render('series', { title: 'Series', series: data.recordset });
    }
    res.end();
  });
};
