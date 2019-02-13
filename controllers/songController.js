var Song = require('../models/song');
// var async = require('async');
var Airtable = require('airtable');
var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_MUSICLAB_BASE);

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

exports.listSongs = function(req, res, next) {
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
      })
    }
    res.render('nmt/links-to-songs', {title: "Recent Songs", message: "These are the links.", data: dataForClient});
  });
};

exports.getSong = function(req, res, next){
  base('Songs').find(req.params.id, function(err, record) {
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

exports.createSongGet = function(req, res) {
    res.render('at/songCreate', {title: "Create Person", tabTitle: "Create Person"});
};

exports.createSongPost = function(req, res) {
    console.log("just got a post request:\n" + JSON.stringify(req.body, null, 4));
    req.checkBody('firstName', 'must have a first name.').notEmpty();
    req.checkBody('lastName', 'must have a last name.').notEmpty();
    req.checkBody('title', 'must have a title.').notEmpty();
    req.sanitize('firstName').escape();
    req.sanitize('lastName').escape();
    req.sanitize('title').escape();
    req.sanitize('firstName').trim();
    req.sanitize('lastName').trim();
    req.sanitize('title').trim();
    var errors = req.validationErrors();
    console.log("the errors are " + JSON.stringify(errors, null, 4));
    var thePerson = new Person({firstName: req.body.firstName, lastName: req.body.lastName, title: req.body.title});
    if (errors) {
      res.render('database/person_create', {title: 'Create Person', tabTitle: 'Create Person', errors: errors});
      return;
    }
    else {
      //  check if person already exists
      theFullName = (req.body.firstName + " " + req.body.lastName);
      Person.findOne({'fullName': theFullName})
        .exec(function(err, found_person){
          console.log('found person: ' + found_person);
          if (err) {
            return next(err);
          }
          else {
            thePerson.save(function(err) {
              if (err) {
                return next(err);
              }
              res.redirect(thePerson.url)
            })
          }
        })
    }

};
//
// exports.person_delete_get = function(req, res, next) {
//   async.parallel({
//     person: function(callback) {
//           Person.findById(req.params.id).exec(callback)
//       }
//       // ,
//       // authors_books: function(callback) {
//       //   Book.find({ 'author': req.params.id }).exec(callback)
//       // },
//     }, function(err, results) {
//       console.log(JSON.stringify(results, null, 4));
//       if (err) { return next(err); }
//       if (results.person==null) { // No results.
//           res.redirect('/database/people');
//       }
//       // Successful, so render.
//       console.log("about to search for person_delete");
//       Shoot.find({people: results.person.firstName}, (err, shoots)=>{
//         res.render('database/person_delete', { title: 'Delete Person', tabTitle: 'Delete Person', thePerson: results.person, personShoots: shoots} );
//       })
//     });
// };
//
// exports.person_delete_post = function(req, res) {
//   console.log("starting delete function");
//   console.log(JSON.stringify(req.body, null, 4));
//     async.parallel({
//         shoot: function(callback) {
//           Shoot.findById(req.body.dbId).exec(callback)
//         },
//         // authors_books: function(callback) {
//         //   Book.find({ 'author': req.body.authorid }).exec(callback)
//         // },
//     }, function(err, results) {
//         if (err) { return next(err); }
//         // Success
//         // if (results.authors_books.length > 0) {
//         //     // Author has books. Render in same way as for GET route.
//         //     res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
//         //     return;
//         // }
//         else {
//             Person.findByIdAndRemove(req.body.dbId, function deletePerson(err) {
//                 if (err) { return next(err); }
//                 // Success - go to author list
//                 res.redirect('/database/people')
//             })
//         }
//     });
// };
//
// exports.person_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: person update GET');
// };
//
// exports.person_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: person update POST');
// };
