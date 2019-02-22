var Person = require('../models/person');
// var async = require('async');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

exports.listPeople = function(req, res, next) {
  var linksArray = [];
  console.log("going to get list of people from AT");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('People').select({
    maxRecords: 50,
    view: "Grid view"
  }).firstPage().then(result => {
    console.log(JSON.stringify(result, null, 4));
    var dataForClient = [];
    for (var i = 0; i < result.length; i++) {
      dataForClient.push({
        name: result[i].fields.Name,
        mlName: result[i].fields.mlName,
        url: ('/at/people/' + result[i].id),
        nmtid: result[i].fields['New Music Tuesday'],
      })
    };
    res.render('links-to-people', {title: "People", message: "These are the people of the LL.", data: dataForClient});
  });
};

exports.getPerson = function(req, res, next){
  base('People').find(req.params.id, function(err, record) {
    if (err) { console.error(err); return; }
    console.log(JSON.stringify(record, null, 4));
    if (record.fields['New Music Tuesday']) {
      base('Songs').find(record.fields['New Music Tuesday'][0], function(err, songrecord) {
        if (err) {console.error(err); return; };
        var youTubeEmbedUrl = ("https://www.youtube.com/embed/" + youtube_parser(songrecord.fields.YouTube_URL))
        console.log(JSON.stringify(songrecord, null, 4));
        res.render('at/people', {
          name: record.fields.Name,
          mlName: record.fields.mlName,
          nmtid: record.fields['New Music Tuesday'],
          title: songrecord.fields['Song Title'],
          artist: songrecord.fields.Artist,
          reflection: songrecord.fields.Reflection,
          youTubeUrl: youTubeEmbedUrl,
          author: songrecord.fields.Writer_Name,
          date: songrecord.fields.Date,
          notes: songrecord.fields.Notes
        })
      })
    }
    else {
      res.render('at/people', {
        name: record.fields.Name,
        mlName: record.fields.mlName,
        nmtid: record.fields['New Music Tuesday']
      })
    }
  });

}
