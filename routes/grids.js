var express = require('express');
var router = express.Router();
var gridLinks = require('../data/grid-links.json');
var chalk = require('chalk');
var controllerColors = [
  "rgba(255, 40, 3, 0.5)",
  "rgba(0, 40, 233, 0.7)",
  "rgba(255, 230, 3, 0.5)",
  "rgba(150, 40, 253, 0.9)",
  "rgba(0, 140, 173, 0.7)",
  "rgba(20, 40, 203, 0.5)",
  "rgba(40, 40, 50, 0.5)",
  "rgba(0, 240, 133, 0.5)",
]

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('links', {
    title: 'grid controllers',
    data: gridLinks,
    message: 'Here are links to the grid controllers we\'re developing.'
  });
});

router.get('/4', function(req, res, next) {
  var sampleNumbers = []
  for (var i = 0; i < 5438; i++) {
    sampleNumbers.push(("0000" + (i+1)).slice(-4));
  }
  var randomSamples = [];
  for (var i = 0; i < 4; i++) {
    var theIndex = Math.floor(Math.random() * sampleNumbers.length);
    var theColor = controllerColors[Math.floor(Math.random() * controllerColors.length)]
    var theElement = sampleNumbers.splice(theIndex, 1)[0];
    randomSamples.push({
      id: theElement,
      color: theColor,
      url: ("https://s3.amazonaws.com/ll-musiclab/public/mp3_samples/sample_" + theElement + ".mp3")
    });
  }
  console.log("these are the randomSamples: " + JSON.stringify(randomSamples, null, 4));
  res.render('grid-controller', { title: ("These are your samples"), samples: randomSamples });
})

router.get('/16', function(req, res, next) {
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

router.get('/64', function(req, res, next) {
  var sampleNumbers = []
  for (var i = 0; i < 5438; i++) {
    sampleNumbers.push(("0000" + (i+1)).slice(-4));
  }
  var randomSampleIds = [];
  for (var i = 0; i < 64; i++) {
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


module.exports = router;
