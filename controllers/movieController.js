const db = require("../core/db");
const fs = require("fs");
const multer = require("multer");
const uuid = require("uuid");
const jimp = require("jimp");
const fileS = require("file-system");
const moment = require("moment");
const path = require("path");
const faker = require("faker");

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isVideo = file.mimetype.startsWith("video/mp4");
    if (isVideo) {
      next(null, true);
    } else {
      next({ message: "That filetype is not supported" }, false);
    }
  }
};

exports.getMovies = (req, res) => {
  db.executeSql("SELECT * from [Movie]", data => {
    res.render("movies", {
      title: "Movies",
      movies: data.recordset,
      user: req.user
    });
    res.end();
  });
};

exports.renderVideo = (req, res) => {
  // console.log(req.params);
  db.executeSql(
    `SELECT * from [Movie] WHERE MovieID = ${req.params.videoId}`,
    data => {
      const videoFile = data.recordset[0].MovieVideo;
      res.sendFile(path.join(__dirname, "../public/uploads/videos", videoFile));
    }
  );
};

exports.addPlayRecord = (req, res, next) => {
  db.executeSql(
    `INSERT INTO [UserVideoHistory] ([User] ,[Movie] ,[Date]) VALUES ('${req
      .user.Email}', '${req.params.videoId}', '${moment().format(
      "YYYY-MM-DD hh:mm:ss"
    )}') `,
    data => {
      console.log("added Record");
      res.redirect(`/watchNow/${req.params.videoId}`);
    }
  );
};

exports.upload = multer(multerOptions).single("video");

exports.configureMovie = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split("/")[1];
  req.body.video = `${uuid.v4()}.${extension}`;

  fs.writeFile(
    `./public/uploads/videos/${req.body.video}`,
    req.file.buffer,
    err => {
      if (err) throw err;
      console.log("The file has been saved!");
    }
  );
  next();
};

exports.createMovie = (req, res) => {
  console.log(req.body);
  db.executeSql(
    `INSERT INTO [Movie] (MovieID, MovieName, MovieVideo, ReleaseDate, MovieGenre) VALUES
    (${req.body.id}, '${req.body.name}', '${req.body
      .video}',0,'${moment().format("YYYY-MM-DD hh:mm:ss")}, '${req.body
      .genre}')`,
    data => {
      res.redirect("/");
      res.end();
    }
  );
};

exports.addMovie = (req, res) => {
  db.executeSql("SELECT * FROM [Genre]", data => {
    res.render("createMovie", { title: "Add Movie", genres: data.recordset });
  });
};

exports.editMovie = (req, res) => {
  console.log(req.params.videoId);
  db.executeSql(
    `SELECT * from [Movie] WHERE [MovieID] = ${req.params.videoId}`,
    (data, err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("editMovie", {
          title: `Edit ${data.recordset[0].MovieName}`,
          movie: data.recordset[0]
        });
      }
      res.end();
    }
  );
};

exports.generateRandomMovies = (req, res) => {
  for (let x = 0; x < 1000; x++) {
    const subdate1 = new Date(faker.date.between("1990-01-01", "2017-11-09"));
    const subDate2 = `${subdate1.getFullYear() + 1}-${subdate1.getMonth() +
      1}-${subdate1.getDate()} ${subdate1.getHours()}:${subdate1.getMinutes()}:${subdate1.getSeconds()}`;
    db.executeSql(
      `INSERT INTO [Movie] (MovieID, MovieName, MovieVideo, ReleaseDate) VALUES
      (${faker.random.number()}, '${faker.random.words()}','video.mp4','${subDate2}')`,
      data => {
        console.log(`Movie${x} created`);
      }
    );
  }
  res.send("/");
};
exports.search = (req, res) => {
  console.log(req.query);
  db.executeSql(
    `SELECT * FROM [Movie] WHERE MovieName LIKE '%${req.query.search}%'`,
    data => {
      res.render("movies", {
        title: "Movies",
        movies: data.recordset,
        user: req.user
      });
    }
  );
};
