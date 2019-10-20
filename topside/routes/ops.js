var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('ops', { title: "Jesuit Robotics"});
});

module.exports = router;
