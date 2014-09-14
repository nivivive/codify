/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var bodyParser = require('body-parser');
var fs = require("fs");
var ideone = require('./ideone');

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
    console.log(req.param("gameId") + "game id");
    res.render('game', {gameId : req.param("gameId")});
});

// posting form data
app.post('/request-game', function(req, res) {
    // use game id to pull in untranslated code
    // and set editor language modes
    res.redirect("/game/" + 1);
});

// render game outcome
app.get('/game-status', function(req, res) {
});

// get untranslated code form
app.get('/translate-form/:projectId', function(req, res) {
    res.render('translate', {projectId: req.param("projectId")});
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
    // can access req.body.project, req.body.fromlang, req.body.tolang
    console.log("project " + req.body.project);
    res.redirect("/translate-form/" + 1)
});

// posting untranslated code for new project
app.post('/request-translate/:projectId', function(req, res) {
    // push to database broken up chunks of code
    res.redirect("/project/" + req.params("projectId"));
});

// see project page + status
app.get('/project/:projectId', function(req, res) {
    res.render("project", {projectId: req.params("projectId")});
});

app.get("/savedCode", function(request, response) {
    response.send({
        code: code,
        success: true
    });
});

app.post("/savedCode", function(request, response) {
    console.log("Trying to save code:", request.body.code);
    writeFile("data.txt", request.body.code);
    code = JSON.parse(request.body.code);
    response.send({
        code: code,
        success:true
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
        console.log("INITIAL CODE", code);
    });
}

initServer();
app.listen(port);
console.log('App started on port ' + port);

