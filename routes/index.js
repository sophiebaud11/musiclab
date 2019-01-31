var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'the secret musicLab' });
});

router.get('/samples/:sampleId', function(req, res, next) {
  console.log("req params are " + JSON.stringify(req.params));
  var counter = ("0000" + (req.params.sampleId+1)).slice(-4);
  var soundUrl = ("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + counter + ".mp3")
  res.render('instrument', { title: ('Sample ' + counter), sampleId: counter, theSoundUrl: soundUrl });
});

module.exports = router;
