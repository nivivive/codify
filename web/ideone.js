// documentation @ http://ideone.com/files/ideone-api.pdf
// available languages @ http://ideone.com/faq#supported-languages

var soap = require('soap');
var url = 'http://ideone.com/api/1/service.wsdl';
var user = 'jzhang94';
var pass = 'icecreamcone';

var testFunction = function(success) {
	soap.createClient(url, function(err, client) {
		client.testFunction({user: user, pass: pass}, function(err, result) {
			success(res2json(result));
		});
	});
};

var getLanguages = function(success) {
	soap.createClient(url, function(err, client) {
		client.getLanguages({user: user, pass: pass}, function(err, result) {
			success(res2json(result));
		});
	});
};

var createSubmission = function(language, sourceCode, input, success) {
	soap.createClient(url, function(err, client) {
		client.createSubmission({
			user: user,
			pass: pass,
			sourceCode: sourceCode,
			language: language,
			input: input,
			run: true,
			private: true
		}, function(err, result) {
			success(res2json(result)); // result['link'] is the important field
		});
	});
};

var getSubmissionStatus = function(link, success) {
	soap.createClient(url, function(err, client) {
		client.getSubmissionStatus({user: user, pass: pass, link: link}, function(err, result) {
			success(res2json(result));
		});
	});
};

var getSubmissionDetails = function(link, success) {
	soap.createClient(url, function(err, client) {
		client.getSubmissionDetails({
			user: user,
			pass: pass,
			link: link,
			withSource: true,
			withInput: true,
			withOutput: true,
			withStderr: true,
			withCmpinfo: true
		}, function(err, result) {
			success(res2json(result));
		});
	});
};

var verify = function(expected) {
	return function(res) { return res['output'] == expected; };
};

var res2json_ = function(result) {
  result = result.item;
  if (!result)
    return null;
  var ret = {};
  for (i = 0; i < result.length; i++) {
    if (result[i].value.$value)
      ret[result[i].key.$value] = result[i].value.$value;
    else
      ret[result[i].key.$value] = res2json_(result[i].value);
  }
  return ret;
}

var res2json = function(result) {
  result = result['return'];
  return res2json_(result);
}
