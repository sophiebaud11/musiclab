// var async = require('async');
var chalk = require('chalk');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

exports.listPages = function(req, res, next) {
  var linksArray = [];
  console.log("going to get list of songs from AT");
  console.log(process.env.AIRTABLE_API_KEY);
  console.log(process.env.AIRTABLE_MUSICLAB_BASE);
  base('CustomPages').select({
    maxRecords: 50,
    view: "Recent"
  }).firstPage().then(result => {
    console.log(JSON.stringify(result, null, 4));
    var dataForClient = [];
    for (var i = 0; i < result.length; i++) {
      dataForClient.push({
        title: result[i].fields.Title,
        description: result[i].fields.visibleDescription,
        url: ('/at/page/' + result[i].fields.pathBasename)
      })
    }
    res.render('nmt/links-to-songs', {title: "Recent Songs", message: "These are the links.", data: dataForClient});
  });
};


exports.getPage = function(req, res, next) {
  console.log("going to look for resources for " + req.params.id);
    base('CustomPages').select({
    filterByFormula: ('pathBasename="' + req.params.id + '"'),
    maxRecords: 5
    })
    .firstPage()
    .then( async function(records){
      console.log("found some records!");
      console.log(records.length);
      if (records.length > 1) {
        console.log("there may be a double-entry problem here");
      };
      if (records.length == 1) {
        console.log("great--just one record");
      }
      console.log(chalk.cyan(JSON.stringify(records, null, 4)));
      var pageData = {
        title: records[0].get('Title'),
        topText: records[0].get('visibleDescription'),
        bottomText: records[0].get('bottomText'),
        youtubeIds: records[0].get('YouTube'),
        songIds: records[0].get('Songs'),
        youtubeResources: [],
        songResources: [],
      };
      if (pageData.youtubeIds.length > 0) {
        for (var i = 0; i < pageData.youtubeIds.length; i++) {
          console.log("looking for " + pageData.youtubeIds[i]);
          var newResource = await getRecord(base('YouTube'), pageData.youtubeIds[i]);
          pageData.youtubeResources.push(
            {
              title: newResource.fields.Title,
              description: newResource.fields.Description,
              URL: newResource.fields.URL,
              youtubeId:newResource.fields.youtubeId
            }
          );
        }
      }
    // let's go check Airtable for that page's resources
    return pageData
    },
    function done(error) {
    })
    .then(pageData => {
      res.render('at/customPage', {data: pageData});
      console.log("about to render a page with ");
      console.log(chalk.red(JSON.stringify(pageData, null, 4)));

    })
    .catch(err => {
      console.log(err);
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
