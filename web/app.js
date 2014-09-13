/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var fs = require("fs");

// setup middleware
var app = express();
app.use(app.router);
app.use(express.errorHandler());
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views

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
app.get('/game', function(req, res) {
    // use game id to pull in untranslated code
    // and set editor language modes
});

// render game outcome
app.get('/game-status', function(req, res) {
});

// get untranslated code form
app.get('/translate-form', function(req, res) {
});

// get translated code
app.get('/translated', function(req, res) {
});

// posting form data
app.post('/request-game', function(req, res) {
    console.log('req.body.name', req.body['name']);
});

// posting generated code
app.post('/verify-code', function(req, res) {
    // find save way of sending code to server.
    // use ideone to verify code and output results
});

// posting untranslated code form data
app.post('/request-translate', function(req, res) {
    // push to database broken up chunks of code
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

