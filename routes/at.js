var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("got a request for airtable");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('New Music Tuesday').select({
    // Selecting the first 3 records in Grid view:
    maxRecords: 20,
    view: "Recent"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.

    records.forEach(function(record) {
        console.log('Retrieved', record.get('Song Title'));
    });
    res.render('json', {title: "JSON of AT response", data: records});
    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();

}, function done(err) {
    if (err) { console.error(err); res.send("got a request for AT, but hit API problem");  }
});



});

module.exports = router;
