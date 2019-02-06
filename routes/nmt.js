var express = require('express');
var router = express.Router();
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  var linksArray = [];
  console.log("got a request for airtable");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('New Music Tuesday').select({
    maxRecords: 50,
    view: "Recent"
  }).firstPage().then(result => {
    console.log(JSON.stringify(result, null, 4));
    var dataForClient = [];
    for (var i = 0; i < result.length; i++) {
      dataForClient.push({
        title: result[i].fields["Song Title"],
        artist: result[i].fields.Artist,
        url: ('/nmt/song/' + result[i].id),
        youtubeLink: result[i].fields.YouTube_URL,
      })
    }
    res.render('nmt/links-to-songs', {title: "Recent Songs", message: "These are the links.", data: dataForClient});
  });
});

router.get('/song/:id', function(req, res, next){
  base('New Music Tuesday').find(req.params.id, function(err, record) {
    if (err) { console.error(err); return; }
    var youTubeEmbedUrl = ("https://www.youtube.com/embed/" + youtube_parser(record.fields.YouTube_URL))
    console.log(JSON.stringify(record, null, 4));
    res.render('nmt/song', {
      title: record.fields['Song Title'],
      artist: record.fields.Artist,
      reflection: record.fields.Reflection,
      youTubeUrl: youTubeEmbedUrl,
      author: record.fields.Writer_Name,
      date: record.fields.Date,
      notes: record.fields.Notes
    });
  });
})

module.exports = router;
