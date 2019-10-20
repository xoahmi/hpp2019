var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('cop', { title: "Jesuit Robotics"});
//  res.send('respond with a resource');
});

module.exports = router;
