var http = require("http");
var url = require("url");
var fs = require("fs");
var bl = require("bl");


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
  	var responseString = "";

	if(parsedUrl.pathname === "/postlocation"){

	  	
	  	req.on('data', function (data){
	  		responseString += data;
	  	});
	  	req.on('end', function(){
	  		var responseObject = JSON.parse(responseString);
	  		console.log(responseObject.person[0].vorname);

	    	res.writeHead(200, { 'Content-Type': 'application/json', 
	    		'Access-Control-Allow-Origin': '*',
	    		'Access-Control-Allow-Headers' : 'Content-Type'
	    	});
	    	res.end(JSON.stringify({"message":"A-OK!"}));
	    });
	}else if (parsedUrl.pathname === "/getcontacts"){
	   	res.writeHead(200, { 'Content-Type': 'application/json', 
    		'Access-Control-Allow-Origin': '*',
    		'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end(JSON.stringify(contacts));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json', 
	    	'Access-Control-Allow-Origin': '*',
	    	'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end();
	}

});


/*
var server = http.createServer(function (req, res) {
  	var parsedUrl = url.parse(req.url, true);
  	//console.log(parsedUrl);
  	//console.log(req.method);
  	//console.log(req.url);

	if (parsedUrl.pathname === "/getcontacts"){
	   	res.writeHead(200, { 'Content-Type': 'application/json', 
    		'Access-Control-Allow-Origin': '*',
    		'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end(JSON.stringify(contacts));
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json', 
	    	'Access-Control-Allow-Origin': '*',
	    	'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end();
	}	
	
});
*/

server.listen(8000);
console.log("Server is running.");




