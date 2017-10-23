const db = require('../core/db');

exports.getMovies = (req, res) => {
  db.executeSql('SELECT * from [Movie]', (data, err) => {
    if (err) {
    } else {
      res.render('movies', { title: 'Movies', movies: data.recordset });
    }
    res.end();
  });
};
