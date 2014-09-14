/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var ideone = require('./ideone');
var mongoose = require('mongoose');

// setup middleware
var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(app.router);
app.use(express.errorHandler());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public')); //setup static public directory

var db;
// setup db
mongoose.connect('mongodb://IbmCloud_9lh68nv7_a79tmedj_un7b3bfh:4kqYZGzP7GAM6eA73rX6PJy2aiyfdxL1@ds035760.mongolab.com:35760/IbmCloud_9lh68nv7_a79tmedj',
  function(err, db_) {
    if (err) throw err;
    db = db_;
    console.log("Database connected");
  });

// SCHEMAS
var Project = mongoose.model('Project', {
  name: String,
  fromLang: Number,
  toLang: Number
});

var Challenge = mongoose.model('Challenge', {
  projectId: mongoose.Schema.ObjectId,
  isCompleted: {type: Number, default: 0},
  stdin: String,
  fromLang: Number,
  toLang: Number
});

var Code = mongoose.model('Code', {
  text: String,
  isOriginal: {type: Number, default: 0},
  challengeId: {type: mongoose.Schema.ObjectId, ref: 'Challenge'},
  language: Number,
  isEvaluated: {type: Number, default: 0},
  stdout: {type: String, default: null},
  stderr: String,
  cmpinfo: String,
  memory: Number,
  link: String,
  time: Number
});

var Game = mongoose.model('Game', {
    challengeIds: [{type: mongoose.Schema.ObjectId, ref:'Challenge'}],
    fromLang: String,
    toLang: String,
    scoreOne: {type: Number, default: 0},
    scoreTwo: {type: Number, default: 0},
    onIterOne: {type: Number, default: 0},
    onIterTwo: {type: Number, default: 0}
});

// ADMIN VIEW
app.get('/admin/projects', function(req, res) {
  Project.find(function (err, projects) {
    ideone.getLanguages(function(data) {
      res.render('admin/projects', {
        projects: projects,
        languages: data['languages']
      });
    });
  });
});

app.post('/admin/projects', function(req, res) {
  var p = new Project(req.body);
  p.save(function(err, p) {
    console.log(p);
    res.redirect(301, '/admin/projects');
  });
});

app.get('/admin/projects/:projectId', function(req, res) {
  var projectId = mongoose.Types.ObjectId(req.param('projectId'));
  Project.findOne({_id: projectId}, function(err, project) {
    Challenge.find({projectId: projectId}, function(err, challenges) {
      console.log(challenges);
      Code.find({challengeId: {$in: challenges.map(function(e) { return e._id; })}}, function(err, codes) {
        res.render('admin/project', {
          project: project,
          languages: ideone.getLanguagesSync()['languages'],
          challenges: challenges,
          codes: codes
        });
      });
    });
  });
});

app.post('/admin/projects/:projectId', function(req, res) {
  var projectId = mongoose.Types.ObjectId(req.param('projectId'));
  Project.findOne({_id: projectId}, function(err, project) {
    req.body['projectId'] = projectId;
    req.body['fromLang'] = project.fromLang;
    req.body['toLang'] = project.toLang;
    var ch = new Challenge(req.body);
    ch.save(function(err, ch) {
      console.log(ch);
      ideone.createSubmission(project.fromLang, req.body.code, ch.stdin, function(data) {
        var c = new Code({
          text: req.body.code,
          isOriginal: 1,
          challengeId: ch._id,
          language: project.fromLang,
          isEvaluated: 0,
          link: data['link']
        });
        c.save(function(err, c) {
          console.log(c);
          res.redirect(301, '/admin/projects/' + req.body['projectId']);
        });
      });
    });
  });
});

app.get('/admin/challenges', function(req, res) {
  Challenge.find({}, function(err, challenges) {
    Code.find({}, function(err, codes) {
      res.render('admin/challenges', {challenges: challenges, codes: codes});
    });
  });
});

app.post('/admin/challenges', function(req, res) {
  var challengeId = mongoose.Types.ObjectId(req.body.challengeId);
  Challenge.findOne({_id: challengeId}, function(err, challenge) {
    if (err) console.log('[error] probably unmatched challengeId');
    ideone.createSubmission(challenge.toLang, req.body.code, challenge.stdin, function(data) {
      var c = new Code({
        text: req.body.code,
        isOriginal: 0,
        challengeId: challengeId,
        language: challenge.toLang,
        isEvaluated: 0,
        link: data['link']
      });
      c.save(function(err, c) {
        console.log(c);
        res.redirect(301, '/admin/challenges');
      });
    });
  });
});

app.get('/api/update/:codeId', function(req, res) {
  var codeId = mongoose.Types.ObjectId(req.param('codeId'));
  Code.findOne({_id: codeId}, function(err, code) {
    if (err) console.log("[error] probably unmatched codeId");
    if (!code.isEvaluated) {
      ideone.getSubmissionStatus(code.link, function(data) {
        if (data.status == '0') {
          ideone.getSubmissionDetails(code.link, function(data) {
            console.log(data);
            // update code with stuffs
            Code.findOneAndUpdate({_id: codeId}, {$set: {
              isEvaluated: 1,
              stdout: data.stdout || "",
              stderr: data.stderr || "",
              cmpinfo: data.cmpinfo,
              memory: data.memory,
              time: data.time
            }}, {}, function(err, code) {
              if (err) console.log(err);
              console.log("aww yiss hi five");
              res.send(data);
            });
          });
        } else {
          res.send(data);
        }
      });
    } else {
      res.send(code);
    }
  });
});

var code;

function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

app.get("/savedCode", function(request, response) {
    response.send({
        code: code,
        success: true
    });
});

app.post("/savedCode", function(request, response) {
    console.log("Trying to save code:", request.body.code);
    writeFile("data.txt", request.body.code);
    // code = JSON.parse(request.body.code);
    // response.send({
    //     code: code,
    //     success:true
    // });
});

// render index page
app.get('/', function(req, res){
  res.render('index');
});

// render form page
app.get('/form', function(req,res) {
  res.render('form');
});

// render game page
app.get('/game/:gameId', function(req, res) {
    // use game id to pull in untranslated code
    // and set editor language modes
    var gameId = mongoose.Types.ObjectId(req.param('gameId'));
    Game.findOne({_id: gameId}, function(err, game) {
      console.log(game);
      // ASSUMING PLAYER 1
      var challengeId = game.challengeIds[game.onIterOne];
      Code.findOne({isOriginal: 1, challengeId: challengeId}, function(err, code) {
        res.render('game', {
          gameId : req.param("gameId"),
          fromLang: game.fromLang,
          toLang: game.toLang,
          codeId: code._id,
          challengeId: challengeId });
      });
    });
    console.log(req.param("gameId") + "game id");
});

app.get('/code/:codeId', function (req, res) {
    var codeId = mongoose.Types.ObjectId(req.param('codeId'));
    Code.findOne({_id:codeId}, function(err, code) {
        res.send({code:code.text});
    });
});

// posting form data
app.post('/request-game', function(req, res) {
    // use game id to pull in untranslated code
    // and set editor language modes

    var toLang = req.body.toLang;
    var fromLang = req.body.fromLang;

    console.log(toLang);
    console.log(fromLang);
    Challenge
    .find({toLang:toLang, fromLang:fromLang})
    .limit(5)
    .exec(function (err, challenges) {
        if (err) {
            res.redirect('/');
        } else {
            var g = new Game({
                toLang:toLang,
                fromLang:fromLang,
                challengeIds: challenges.map(function(e) { return e._id; })
            });
            g.save(function (err, g) {
                res.redirect("/game/" + g._id);
            });

        }
    });
});

// render game outcome
app.get('/game-status', function(req, res) {
});

// get untranslated code form
app.get('/translate-form', function(req, res) {
    res.render('translate');
});

// get translated code
app.get('/translated', function(req, res) {
});


// posting generated code
app.post('/verify-code', function(req, res) {
    // find save way of sending code to server.
    // use ideone to verify code and output results

    // TODO: populate these with user input and database values
    var source_language = null;
    var target_language = null;
    var source_code = null;
    var target_code = null;
    var input = null;

    // run source against target -- actually, shouldn't do this if already cached
    ideone.createSubmission(source_language, source_code, input, function(data_source) {
      var link_source = data_source['link'];
      ideone.createSubmission(target_language, target_code, input, function(data_target) {
        var link_target = data_target['link'];
        // TODO: save both link_source and link_target as an instance of a trial (and cache the result when available)
        // and return a status to the user. Direct the user to poll /check-status with the trial id every 3 seconds.
      });
    });
});

app.post('/check-status', function(req, res) {
  // TODO: lookup the given trial id from database. if result available, return.
  // if result not available, call ideone.getSubmissionStatus(...). if available, call ideone.getSubmissionDetails(...) and cache results in database.
  // if unavailable, return 'check back later'.
});

// posting creating project form data
app.post('/request-project', function(req, res) {
    // create project
    // push to database broken up chunks of code
    // can access req.body.project, req.body.fromlang, req.body.tolang
    var name = req.body.project;
    var challenges = req.body.challenges;
    var fromLang = req.body.fromLang;
    var toLang = req.body.toLang;

    var p = new Project({
        name: name,
        fromLang: fromLang,
        toLang: toLang
    });

    p.save(function(err, p) {
      console.log(p);
      if (!err) {
        console.log(challenges);
        for (var i=0; i < challenges.length; i++) {
          var ch = new Challenge({
              projectId: p._id,
              toLang: p.toLang,
              fromLang: p.fromLang,
              stdin: ""
          });
          ch.save(function(err, ch) {
            console.log(ch);
            console.log("hard code to avoid challenges[i] race");
            console.log(challenges[0]);
            ideone.createSubmission(p.fromLang, challenges[0], ch.stdin, function(data) {
              var c = new Code({
                text: challenges[0],
                isOriginal: 1,
                challengeId: ch._id,
                language: p.fromLang,
                isEvaluated: 0,
                link: data['link']
              });
              c.save(function(err, c) {
                console.log(c);
                res.send("success");
              });
            });
          });
        }
      }
    });
});

// see project page + status
app.get('/projects', function(req, res) {
    // do on callback w/ all of the projects
    Project.find({}, function (err, ps) {
        res.render("projects", {projects: ps});
    });
});


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
function initServer() {
    var defaultCode = "";
    readFile("data.txt", defaultCode, function(err, data) {
        code = JSON.parse(data);
        //console.log("INITIAL CODE", code);
    });
}

initServer();
app.listen(port);
console.log('App started on port ' + port);

