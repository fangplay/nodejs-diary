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
  // res.send("Index Page System");
  // return res.status(200);
  res.sendFile(path.join(__dirname, "public", "./views/index.html"));
});

app.get('/diary-list', (req, res) => {
  const diaries = db.get('diary').value();
  return res.send(diaries).status(200);
})

app.get('/os-list', (req, res) => {
  const os = db.get('os').value();
  return res.json(os).status(200);
})

app.post('/diary-add', (req, res) =>{
  const data = {
    id:nanoid.nanoid(),
    title:req.body.title,
    description:req.body.description,
    date:req.body.date
  }
  db.get('diary')
  .push(data)
  .last()
  .write()
  return res.status(200).send(
    db.get('diary').last().value()
  );
})

app.post('/os-add', (req, res) =>{
  const data = {
    id:nanoid.nanoid(),
    title:req.body.title,
    type:req.body.type
  }
  db.get('os')
  .push(data)
  .last()
  .write()
  return res.status(200).send(
    db.get('os').last().value()
  );
})

app.listen(port, () => {
  console.log("Server started on http://localhost:" + port);
});