//Node.js ==> Express Framework (SIMPLE SERVER)
const express = require("express");
const mongoose = require("mongoose");
let app = express();
//Port to listen on
const PORT = 3000;

const path = require("path");
const bodyParser = require("body-parser");
const bootstrap = require("./src/boostrap");
const session = require('express-session')
const dummy = require('./dummy_data/dummy');

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }
}))

//Use a Custom Templating Engine
app.set("view engine", "ejs");

app.set("views", path.resolve("./src/views"));

//Request Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Create Express Router
const router = express.Router();
app.use(router);

const rootPath = path.resolve("./public");
app.use(express.static(rootPath));

bootstrap(app, router);

//Main Page (Home)
router.get("/", (req, res, next) => {
  return res.render("index");
});

router.use((err, req, res, next) => {
  if (err) {
    //Handle file type and max size of image
    return res.send(err.message);
  }
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/myDB"
    );

    app.listen(PORT, err => {
      if (err) return console.log(`Cannot Listen on PORT: ${PORT}`);
      console.log(`Server is Listening on: http://localhost:${PORT}/`);
    });

  }
  catch (error) {
    console.error(error);
    process.exit(1);
  }
}

dummy();
start();