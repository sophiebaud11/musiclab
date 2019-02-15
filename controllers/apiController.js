// var async = require('async');
var chalk = require('chalk');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

exports.getPage = function(req, res, next) {
  console.log("going to look for resources for " + req.params.id);
  var linksArray = [];
  console.log("going to get list of songs from AT");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('Songs').select({
    maxRecords: 50,
    view: "Recent"
  }).firstPage().then(result => {
    console.log(JSON.stringify(result, null, 4));
    var dataForClient = [];
    for (var i = 0; i < result.length; i++) {
      dataForClient.push({
        title: result[i].fields["Song Title"],
        artist: result[i].fields.Artist,
        url: ('/at/song/' + result[i].id),
        youtubeLink: result[i].fields.YouTube_URL,
        reflection: result[i].fields.reflection,
        date: result[i].fields.Date,
        writer: result[i].fields.Writer_Name[0]
      })
    }
    res.json({title: "Recent Songs", message: "These are the links.", data: dataForClient});
  });
}

async function getRecord(theTable, id) {
  console.log("starting getRecord");
  var theResult = await theTable.find(id).then(result => {
    console.log('got result');
    console.log(JSON.stringify(result, null, 4));
    return result
  });
  return theResult;
}
