var express = require('express');
var app     = express();
var fs = require('fs');
var url = require('url');
var http = require('http');
var sys=require('sys');

app.use(express.bodyParser());

app.get('/', function(req, res) {
	res.sendfile("fetch.html");
});
app.get('/mainScript.js',function(req,res) {
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.sendfile("mainScript.js");
});
app.get('/jquery.min.js', function(req, res) {
	res.sendfile("jquery.min.js");
});
app.get('/fetchCss.css', function(req, res) {
	res.sendfile("fetchCss.css");
});
app.get('/handlebars-v1.2.0.js',function(req,res) {
	res.sendfile("handlebars-v1.2.0.js");
});

app.get('/fetchEngine', function(request, response) {
	//console.log('query received')
	/*var query=url.parse(request.url, true).query;
	console.log(query['info']);*/
	var query=url.parse(request.url, false).query;
  //res.send('You sent the name "' + query + '".');
  //console.log(query);
	var options = {
	  host: 'www.quinterest.org',
	  port: 80,
	  path: '/php/search.php?'+query+'&categ=All&difficulty=HS&tournamentyear=All',
	};
	http.get(options, function(result) {
		//console.log('STATUS: ' + result.statusCode);
		//console.log('HEADERS: ' + JSON.stringify(result.headers));
		result.setEncoding('utf8');
		result.on('data', function (chunk) {
			//console.log('BODY: ' + chunk);
			response.write(chunk);
		});
		result.on('end', function () {
		    response.end();
		    //console.log("query ended");
		});
	}).on('error',function(err) {
		console.log(err.message);
		response.send(err);
	});

});

app.listen(8080, function() {
  console.log('Server is now running! Huehuehue!');
});

function checkSite(url) {
    var site = http.createClient(80, url);
    site.on('error', function(err) {
        sys.debug('unable to connect to ' + url);
        console.log(err);
    });
    var request = site.request('GET', '/', {'host': url});
    request.end();
    request.on('response', function(res) {
        sys.debug('status code: ' + res.statusCode);
    });
}