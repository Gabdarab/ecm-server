var http = require("http");
var url = require("url");

var contacts={
	"person":[
		{
			"vorname":"Peter",
			"nachname":"Klein",
			"longitude":"44.811805",
			"latitude":"-93.176352",
			"time":""
		},
		{
			"vorname":"Anne",
			"nachname":"Weiss",
			"longitude":"44.750453",
			"latitude":"-93.204766",
			"time":""
		},
		{
			"vorname":"Thomas",
			"nachname":"Gross",
			"longitude":"44.788673",
			"latitude":"-93.205671",
			"time":""
		},
		{
			"vorname":"Petra",
			"nachname":"Schwarz",
			"longitude":"44.736285",
			"latitude":"-93.207487",
			"time":""
		}
		
	]
};


var server = http.createServer(function (req, res) {
  	var parsedUrl = url.parse(req.url, true);
  	var result;

	if (parsedURL.pathname === "/api/contacts")
    	result = contacts;

  	if (result) {
    	res.writeHead(200, { 'Content-Type': 'application/json' });
    	res.end(JSON.stringify(result));
  	} else {
    	res.writeHead(404);
    	res.end();
  	}
});
server.listen(8000);
console.log("Server is running.");

/*
var parsedUrl = url.parse("http://127.0.0.1:8000/api/contacts", true);
console.log(parsedUrl);
*/
