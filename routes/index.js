var express = require('express');
var router = express.Router();
var musicCodeLinks = require('../data/music-code-links.json');
var frontPageLinks = require('../data/front-page-links.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('links', { title: 'the secret musicLab', message: "Here are some links to stuff we've made so far.", data: frontPageLinks });
});

router.get('/samples/:sampleId', function(req, res, next) {
  console.log("req params are " + JSON.stringify(req.params));
  var counter = ("0000" + (req.params.sampleId)).slice(-4);
  var soundUrl = ("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + counter + ".mp3")
  res.render('instrument', { title: ('Sample ' + counter), sampleId: counter, theSoundUrl: soundUrl });
});

router.get('/randomsamples', function(req, res, next) {
  var sampleNumbers = []
  for (var i = 0; i < 5438; i++) {
    sampleNumbers.push(("0000" + (i+1)).slice(-4));
  }
  var randomSampleIds = [];
  for (var i = 0; i < 16; i++) {
    var theIndex = Math.floor(Math.random() * sampleNumbers.length);
    var theElement = sampleNumbers.splice(theIndex, 1);
    randomSampleIds.push(theElement);
  }
  console.log("these are the randomSampleIds: " + randomSampleIds);
  var randomSampleUrls = [];
  for (var i = 0; i < randomSampleIds.length; i++) {
    randomSampleUrls.push(("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + randomSampleIds[i] + ".mp3"));
  }
  console.log("these are the randomSampleUrls: " + randomSampleUrls);
  res.render('grid-controller', { title: ("These are your samples"), sampleIds: randomSampleIds, randomSampleUrls: randomSampleUrls });
})

router.get('/links', function(req, res, next) {
  res.render('links', {
    title: 'the musicLab links',
    data: musicCodeLinks,
    message: 'Here are links to useful tutorials, tools, libraries, packages, etc.'
  });
});


module.exports = router;
