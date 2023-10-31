const express = require('express')
const app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('game')
});

var listener = app.listen(
  process.env.PORT || 80,
  process.env.HOST || "0.0.0.0",
  function() {
    console.log("Express server started");
});