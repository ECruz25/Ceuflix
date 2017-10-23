const db = require('../core/db');
const fs = require('fs');
const multer = require('multer');
const uuid = require('uuid');
const jimp = require('jimp');
const fileS = require('file-system');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isVideo = file.mimetype.startsWith('video/mp4');
    if (isVideo) {
      next(null, true);
    } else {
      next({ message: 'That filetype is not supported' }, false);
    }
  }
};

exports.getMovies = (req, res) => {
  db.executeSql('SELECT * from [Movie]', (data, err) => {
    if (err) {
    } else {
      res.render('movies', { title: 'Movies', movies: data.recordset });
    }
    res.end();
  });
};

exports.renderVideo = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'video/mp4' });
  const video = fs.createReadStream(
    `./public/uploads/videos/${req.params.videoId}.mp4`
  );
  video.pipe(res);
};

exports.upload = multer(multerOptions).single('video');

exports.configureMovie = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.video = `${uuid.v4()}.${extension}`;

  fs.writeFile(
    `./public/uploads/videos/${req.body.video}`,
    req.file.buffer,
    err => {
      if (err) throw err;
      console.log('The file has been saved!');
    }
  );
  next();
};

exports.createMovie = (req, res) => {
  console.log(req.body.userType, req.body.gender);
  db.executeSql(
    `INSERT INTO [Movie] (MovieID, MovieName, MovieVideo) VALUES
    (${req.body.id}, '${req.body.name}', '${req.body.video}')`,
    data => {
      res.redirect('/');
      res.end();
    }
  );
};

exports.addMovie = (req, res) => {
  res.render('createMovie', { title: 'Add Movie' });
};
