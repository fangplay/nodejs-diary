require("fix-esm").register();
const nanoid = require('nanoid');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const express = require("express");
const ejs = require('ejs');
const bodyParser= require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const adapter = new FileSync(path.join(__dirname, './db.json'));
const db = low(adapter);

// const methodOverride = require("method-override");
// router.use(methodOverride("_method", {
//   methods: ["POST", "GET"]
// }));

// set view engine
app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + './public'));
app.set('views', path.join(__dirname, './public/views'));

app.get("/", (req, res) => {
  // res.render('index')
  res.sendFile(path.join(__dirname, "public", "./views/index.html"));
});

app.get('/diary-list', (req, res) => {
  const diary = db.get('diary').value();
  res.render('diary-list',{ diary: diary })
  // res.sendFile(path.join(__dirname, "public", "./views/diary-list.html"));
  // res.render('diary-list');
})

app.get('/os-list', (req, res) => {
  const os = db.get('os').value();
  res.render('os-list',{ os: os })
  // res.sendFile(path.join(__dirname, "public", "./views/os-list.html"));
  // res.render('os-list');
})

app.get('/diary-add', (req, res) => {
  // res.render('add-diaries')
  res.sendFile(path.join(__dirname, "public", "./views/add-diaries.html"));
})

app.get('/os-add', (req, res) => {
  // res.render('add-os')
  res.sendFile(path.join(__dirname, "public", "./views/add-os.html"));
})

app.get('/diary-edit', (req,res,next) => {
  // let diaryID = req.param.id;
  db.read();
  let did = req.query.id;
  let dataup = db.get('diary').find({ id: did}).value();
  res.render('diary-edit',{ dataup });
  // Diary.findById(diaryID)
  //   .then(diary => {
  //     res.render('diary-edit',{
  //       diary: diary
  //     });
  //   })
  //   .catch(error => {
  //     alert('Error updating diary by ID: ${error.message}');
  //     next(error);
  //   });
})

app.post('/diary-update', (req,res,next) => {
  // let diaryID = req.param.id,
  // diaryParams = {
  //   title : req.body.title,
  //   description : req.body.description,
  //   date : req.body.date
  // };

  // Diary.findByIdAndUpdate(diaryID, {
  //   $set: diaryParams
  // }).then(
  //   diary => {
  //     alert('Updated diary data complete');
  //     rea.locals.redirect = '/diary-list';
  //     res.locals.diary = diary;
  //     next();
  //   }
  // ).catch(error => {
  //   alert('Error updating diary by ID: ${error.message}');
  //   next(error);
  // });
  db.read();
  let did = req.body.id;

  db.get('diary')
  .find({id: did})
  .assign({title: req.body.title})
  .assign({description: req.body.description})
  .assign({date: req.body.date})
  .write()
  .then(
      diary => {
        alert('Updated diary data complete');
        rea.locals.redirect = '/diary-list';
        next();
      }
  )
  .catch(error => {
      alert('Error updating diary by ID: ${error.message}');
      next(error);
  })
})

app.delete('/diary-delete', (req,res,next) => {
  // let diaryID = req.param.id;
  // Diary.findByIdAndRemove(diaryID)
  db.read();
  let did = req.query.id;
  db.get('diary')
  .remove({ id: did})
  .write()
  .then(() => {
    alert('Deleted diary data complete');
    res.locals.redirect = "/diary-list";
    next();
  }).catch(error => {
      alert('Error deleting diary by ID: ${error.message}');
      next(error);
  });
})


app.post('/diary-save',(req,res) => {
  db.read();
  var diary = {
    id : nanoid.nanoid(),
    title : req.body.title,
    description : req.body.description,
    date : req.body.date
  }
  db.get('diary').push(diary).last().write();
  alert('Added diary data complete');
  res.redirect('/diary-add');
})

app.post('/os-save',(req,res) => {
  db.read();
  var os = {
    id : nanoid.nanoid(),
    osname : req.body.name,
    type : req.body.type
  }
  db.get('os').push(os).last().write();
  res.redirect('/os-add');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  console.log("Server started on http://localhost:" + port);
})