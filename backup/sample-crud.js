var express = require('express');
var router = express.Router();
var shortid = require('shortid');

var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('./DBase/shortIdDB.json');
var db = low(adapter);

// default user list
 db.defaults({ users: [] }).write();

/* GET data listing. Display list of current data in table */
router.get('/', (req, res, next) =>  {
 db.read(); //read current datas in db
 var putusers=db.get('users'); // use 'users:' section of db
 var data = putusers.value(); // transfer values from getusers to data
 res.render('index', { data }); // Send values from data to Table
console.log('Your Datas:', data);
});

// Form post -- Start adding data from FORM to DB
router.post('/add', (req, res) => {
 db.read(); //read current datas in db
 /* start collecting data from FORM */
 var FormFeed = {
	id:  shortid.generate(),
	First_Name: req.body.FName, 
	Middle_Name: req.body.MName, 
	Last_Name: req.body.LName, 
	Email: req.body.EMail}; 
/* collect data from FORM end here */	
 db.get('users').push(FormFeed).write(); // push and write to the db
res.redirect('/');
});

// delete selected record via id
router.get('/delete', function(req, res) {
 db.read(); //read current datas in db
 let uid = req.query.id;  // transfer "id" from TABLE to "uid"
 let data = db.get('users').find({ id: uid }).value(); // find and collect data via "uid"
 console.log("User to Process: ", data, "and the id: ", uid);
 /* Do actual deletion of User via ID */
	db.get('users')
	.remove({ id: uid })
	.write();
 /* Do actual deletion of User via ID End here!!! */
 res.status(200);
res.redirect('/');
 });

/* GET data via ID to update and display data in table */
router.get('/toupdate', (req, res, next) =>  {
  db.read(); //read current datas in db
  let uid = req.query.id; // transfer "id" from TABLE to "uid"
  let dataup = db.get('users').find({ id: uid }).value(); // find and collect data via "uid"
  console.log("User to Process: ", dataup, "and the id: ", uid);
res.render('editup', { dataup }); // Send values from data to Table
});

/* Update the data from displayed table of editup.pug */
router.post('/update', (req, res, next) =>  {
  db.read(); //read current datas in db
  let uid = req.body.id; // transfer "id" from TABLE to "uid"
/* Do actual updation of User via ID */
  db.get('users')
  .find({id: uid})
  .assign({First_Name: req.body.First_Name})
  .assign({Middle_Name: req.body.Middle_Name})
  .assign({Last_Name: req.body.Last_Name})
  .assign({Email: req.body.Email})
  .write();
/* Do actual updation of User via ID ends here */
 res.status(200);
res.redirect('/');
});

module.exports = router;