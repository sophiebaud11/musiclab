var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('the secret musicLab', { title: 'the secret musicLab' });
});

module.exports = router;
