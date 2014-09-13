// documentation @ http://ideone.com/files/ideone-api.pdf
// available languages @ http://ideone.com/faq#supported-languages

var soap = require('soap');
var url = 'http://ideone.com/api/1/service.wsdl';
var user = 'jzhang94';
var pass = 'icecreamcone';

var sleep = require('sleep');

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

soap.createClient(url, function(err, client) {
  client.testFunction({user: user, pass: pass}, function(err, result) {
    console.log(res2json(result));
  });
  client.getLanguages({user: user, pass: pass}, function(err, result) {
    console.log(res2json(result));
  });

  client.createSubmission({
    user: user,
    pass: pass,
    sourceCode: "#include <stdio.h>\nint main() { printf(\"Hello, world!\"); return 0; }",
    language: 34,
    input: "test\ntest2",
    run: true,
    private: true
  }, function(err, result) {
    var stuff = res2json(result);
    console.log(stuff);
  
    // delay a bit to get info
    sleep.sleep(10);

    client.getSubmissionStatus({
      user: user,
      pass: pass,
      link: stuff['link']
    }, function(err, result) {
      console.log(res2json(result));
    });

    client.getSubmissionDetails({
      user: user,
      pass: pass,
      link: stuff['link'],
      withSource: true,
      withInput: true,
      withOutput: true,
      withStderr: true,
      withCmpinfo: true
    }, function(err, result) {
      console.log(res2json(result));
    });
  });
});
