const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.listen(3000, () => {
  console.log("Application started and Listening on port 3000");
});

// var express = require('express');
// var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// server css as static
app.use(express.static('./public'));

// get our app to use body parser 
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.sendFile("./public/index.html");
});

// module.exports = router;
