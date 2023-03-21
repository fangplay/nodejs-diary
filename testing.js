require("fix-esm").register();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//lowdb&nanoid => requirement
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const nanoid = require('nanoid');
//edit in file on db.json
const adapter = new FileSync('db.json');
const db = low(adapter);

app.get(`/`, async (req, res) => {
    res.json({ message: "API dev server started"});
    return res.status(200);
  });

app.post(`/beta`, async (req, res) => {
    const data = {
        id:nanoid.nanoid(),
        title:req.body.title
    }
    db.get('os')
      .push(data)
      .last()
      .write()
    res.json({message: "Save data testing completed"});
    return res.status(200);
});

app.listen(port, () => {
    console.log("Starting server on http://localhost:" + port);
  });