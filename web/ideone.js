// documentation @ http://ideone.com/files/ideone-api.pdf
// available languages @ http://ideone.com/faq#supported-languages

var soap = require('soap');
var url = 'http://ideone.com/api/1/service.wsdl';
var user = 'jzhang94';
var pass = 'icecreamcone';

module.exports.testFunction = function(success) {
	soap.createClient(url, function(err, client) {
		client.testFunction({user: user, pass: pass}, function(err, result) {
			success(res2json(result));
		});
	});
};

module.exports.getLanguagesSync = function() {
	return { error: 'OK',
  languages: 
   { '1': 'C++ 4.8.1 (gcc-4.8.1)',
     '2': 'Pascal (gpc) (gpc 20070904)',
     '3': 'Perl (perl 5.16.2)',
     '4': 'Python (python 2.7.3)',
     '5': 'Fortran (gfortran-4.8)',
     '6': 'Whitespace (wspace 0.3)',
     '7': 'Ada (gnat-4.6)',
     '8': 'Ocaml (ocamlopt 3.10.2)',
     '9': 'Intercal (c-intercal 28.0-r1)',
     '10': 'Java (sun-jdk-1.7.0_25)',
     '11': 'C (gcc-4.8.1)',
     '12': 'Brainf**k (bff-1.0.3.1)',
     '13': 'Assembler (nasm-2.10.01)',
     '14': 'CLIPS (clips 6.24)',
     '15': 'Prolog (swi) (swipl 5.6.64)',
     '16': 'Icon (iconc 9.4.3)',
     '17': 'Ruby (ruby-1.9.3)',
     '19': 'Pike (pike 7.6.86)',
     '21': 'Haskell (ghc-7.6.3)',
     '22': 'Pascal (fpc) (fpc 2.6.2)',
     '23': 'Smalltalk (gst 3.1)',
     '25': 'Nice (nicec 0.9.6)',
     '26': 'Lua (luac 5.1.4)',
     '27': 'C# (mono-2.8)',
     '28': 'Bash (bash 4.0.35)',
     '29': 'PHP (php 5.4.4)',
     '30': 'Nemerle (ncc 0.9.3)',
     '32': 'Common Lisp (clisp) (clisp 2.47)',
     '33': 'Scheme (guile) (guile 1.8.5)',
     '34': 'C99 strict (gcc-4.8.1)',
     '35': 'JavaScript (rhino) (rhino-1.7R4)',
     '36': 'Erlang (erl-5.7.3)',
     '38': 'Tcl (tclsh 8.5.7)',
     '39': 'Scala (scala-2.10.2)',
     '40': 'SQL (sqlite3-3.7.3)',
     '41': 'C++ 4.3.2 (gcc-4.3.2)',
     '43': 'Objective-C (gcc-4.5.1)',
     '44': 'C++11 (gcc-4.8.1)',
     '45': 'Assembler (gcc-4.8.1)',
     '54': 'Perl 6 (rakudo-2010.08)',
     '55': 'Java7 (sun-jdk-1.7.0_10)',
     '56': 'Node.js (0.8.11)',
     '57': 'PARI/GP (2.5.1)',
     '62': 'Text (text 6.10)',
     '101': 'VB.NET (mono-2.4.2.3)',
     '102': 'D (dmd) (dmd-2.042)',
     '104': 'AWK (gawk) (gawk-3.1.6)',
     '105': 'AWK (mawk) (mawk-1.3.3)',
     '106': 'COBOL 85 (tinycobol-0.65.9)',
     '107': 'Forth (gforth-0.7.0)',
     '108': 'Prolog (gnu) (gprolog-1.3.1)',
     '110': 'bc (bc-1.06.95)',
     '111': 'Clojure (clojure 1.5.0-RC2)',
     '112': 'JavaScript (spidermonkey) (spidermonkey-1.7)',
     '114': 'Go (1.0.3)',
     '115': 'Unlambda (unlambda-2.0.0)',
     '116': 'Python 3 (python-3.2.3)',
     '117': 'R (R-2.11.1)',
     '118': 'COBOL (open-cobol-1.0)',
     '119': 'Oz (mozart-1.4.0)',
     '121': 'Groovy (groovy-2.1.6)',
     '122': 'Nimrod (nimrod-0.8.8)',
     '123': 'Factor (factor-0.93)',
     '124': 'F# (fsharp-2.0.0)',
     '125': 'Falcon (falcon-0.9.6.6)',
     '127': 'Octave (3.6.2)' } };
}
module.exports.getLanguages = function(success) {
	// caching ftw
	return success(module.exports.getLanguagesSync());
	soap.createClient(url, function(err, client) {
		client.getLanguages({user: user, pass: pass}, function(err, result) {
			success(res2json(result));
		});
	});
};

module.exports.createSubmission = function(language, sourceCode, input, success) {
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

module.exports.getSubmissionStatus = function(link, success) {
	soap.createClient(url, function(err, client) {
		client.getSubmissionStatus({user: user, pass: pass, link: link}, function(err, result) {
			success(res2json(result));
		});
	});
};

module.exports.getSubmissionDetails = function(link, success) {
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

module.exports.verify = function(expected) {
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
