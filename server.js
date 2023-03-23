require("fix-esm").register();
const nanoid = require('nanoid');
const path = require('path');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const express = require("express");
const bodyParser= require('body-parser');
var app = express();;
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

const adapter = new FileSync(path.join(__dirname, './db.json'));
const db = low(adapter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./views/index.html"));
});

app.get('/diary-list', (req, res) => {
  const diary = db.get('diary').value();
  res.sendFile(path.join(__dirname, "public", "./views/diary-list.html"));
})

app.get('/os-list', (req, res) => {
  const os = db.get('os').value();
  res.sendFile(path.join(__dirname, "public", "./views/os-list.html"));
})

app.get('/diary-add', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./views/add-diaries.html"));
})

app.get('/os-add', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "./views/add-os.html"));
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

app.listen(port, () => {
  console.log("Server started on http://localhost:" + port);
});