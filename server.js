require("fix-esm").register();
const nanoid = require("nanoid");
const path = require("path");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//database connect file db
const adapter = new FileSync(path.join(__dirname, "./db.json"));
const db = low(adapter);

app.set("views", path.join(__dirname, "views"));

// Set view engine as EJS
// app.set("view engine", "html");

// Set the view engine (if using a templating engine like EJS)
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
  // res.sendFile(path.join(__dirname, "./views/index.html"));
});

app.get("/diary-list", (req, res) => {
  const diary = db.get("diary").value();
  res.render("diary-list", { diary: diary });
});

// app.get('/os-list', (req, res) => {
//   const os = db.get('os').value();
//   res.render('os-list',{ os: os })
// });

app.get("/diary-add", (req, res) => {
  res.render("add-diaries");
  // res.sendFile(path.join(__dirname, "./views/add-diaries.html"));
});

// app.get('/os-add', (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/add-os.html"));
// });

app.get("/diary-edit/:id", (req, res) => {
  let did = req.params.id;
  let diary = db.get("diary").find({ id: did }).value();
  if (diary) {
    res.render("diary-edit", { diary });
  } else {
    // res.sendFile(path.join(__dirname, "./views/code/404.html"));
    res.render("/code/404");
  }
});

app.post("/diary-edit/:id", (req, res) => {
  const id = req.params.id;

  const update = db
    .get("diary")
    .find({ id: id })
    .assign({ title: req.body.title })
    .assign({ description: req.body.description })
    .assign({ date: req.body.date })
    .write();
  if (update) {
    const diary = db.get("diary").value();
    res.render("diary-list", { diary: diary });
  } else {
    res.render("/code/404");
  }
});

app.get("/diary-delete/:id", (req, res, next) => {
  let id = req.params.id;
  const deleteData = db.get("diary").remove({ id: id }).write();
  if (deleteData) {
    const diary = db.get("diary").value();
    res.render("diary-list", { diary: diary });
  } else {
    res.render("/code/404");
  }
});

app.post("/diary-save", (req, res) => {
  var diary = {
    id: nanoid.nanoid(),
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
  };
  const save = db.get("diary").push(diary).last().write();
  //back to diary list
  if (save) {
    const diary = db.get("diary").value();
    res.render("diary-list", { diary: diary });
  } else {
    res.render("/code/500");
  }
});

// app.post("/os-save", (req, res) => {
//   db.read();
//   var os = {
//     id: nanoid.nanoid(),
//     osname: req.body.name,
//     type: req.body.type,
//   };
//   db.get("os").push(os).last().write();
//   res.redirect("/os-add");
// });

// catch 404 and forward to error handler
// app.use(function (err,req, res) {
//   // next(createError(404));
//   // res.status(err.status || 404);
//   res.render("/code/404");
// });

// error handler
// app.use(function (err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

// //   // render the error page
//   // res.status(err.status || 500);
//   res.render("/code/500");
// });

app.listen(port, () => {
  console.log("Server started on http://localhost:" + port);
});
