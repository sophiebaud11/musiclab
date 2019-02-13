var Song = require('../models/song');
// var async = require('async');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

exports.listRemixes = function(req, res, next) {
  var linksArray = [];
  console.log("going to get list of songs from AT");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('Remixes').select({
    maxRecords: 50,
    view: "Recent"
  }).firstPage().then(result => {
    console.log(JSON.stringify(result, null, 4));
    var dataForClient = [];
    for (var i = 0; i < result.length; i++) {
      dataForClient.push({
        title: result[i].fields.Title,
        artist: result[i].fields.Artist,
        url: ('/at/song/' + result[i].fields.pathBasename),
        youtubeLink: result[i].fields.YouTube_URL,
      })
    }
    res.render('nmt/links-to-songs', {title: "Recent Songs", message: "These are the links.", data: dataForClient});
  });
};

exports.getRemix = function(req, res, next){
  base('Remixes').find(req.params.id, function(err, record) {
    if (err) { console.error(err); return; }
    var youTubeEmbedUrl = ("https://www.youtube.com/embed/" + youtube_parser(record.fields.YouTube_URL))
    console.log(JSON.stringify(record, null, 4));
    res.render('at/song', {
      title: record.fields['Song Title'],
      artist: record.fields.Artist,
      reflection: record.fields.Reflection,
      youTubeUrl: youTubeEmbedUrl,
      author: record.fields.Writer_Name,
      date: record.fields.Date,
      notes: record.fields.Notes
    });
  });
}
