var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var linksArray = [];
  console.log("got a request for airtable");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('New Music Tuesday').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 50,
    view: "Recent"
  }).firstPage().then(result => {
    res.render('nmt/links-to-songs', {title: "Recent Songs", message: "These are the links.", data: result});
  });
});

router.get('/song/:id', function(req, res, next){
  base('New Music Tuesday').find(req.params.id, function(err, record) {
    if (err) { console.error(err); return; }
    res.render('nmt/song', {title: record.fields['Song Title'], data: record});
  });
})

module.exports = router;
