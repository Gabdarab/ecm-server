var http = require("http");
var url = require("url");
var mysql = require('mysql');

var pool = mysql.createPool({
  	host     : 'localhost',
  	user     : 'ecm-server',
  	password : 'mypass',
  	database : 'ecmmobile'
});

// only for testing
var user ={
	"vorname" : "Stefan",
	"nachname" : "Servermann",
	"regcode" : "Servercode"
};
//

var server = http.createServer(function (req, res) {
  	var parsedUrl = url.parse(req.url, true);
  	var responseString = "";
  	// post user information upon registration
	if(parsedUrl.pathname === "/postregistration"){
	  	req.on('data', function (data){
	  		responseString += data;
	  	});
	  	req.on('end', function(){
	  		var responseObject = JSON.parse(responseString);
	  		console.log("postregistraion request recieved.");

	  		pool.getConnection(function(err, connection){
        		if (err){
            		throw err;
        		}else{
        			//include uuid and other device info for smartphones
            		connection.query("INSERT INTO user VALUES ('tempuuid'," + responseObject.vorname + 
            						 "," + responseObject.nachname + "," + responseObject.regcode + ","
            						// + responseObject.devicemodel + "," + responseObject.deviceplatform + "," + responseObject.deviceversion + "," 
            						   + "devicemodel" + "," + "deviceplatform" + "," + "deviceversion" + "," 
            						 + responseObject.timestamp + ")", function(err, rows){
                		if (err) {
                    		throw err;
                		}else{
                    		console.log("postregistration SQL Query finished.");
                    		res.writeHead(201, { 'Content-Type': 'application/json', 
	    									'Access-Control-Allow-Origin': '*',
	    									'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify({"response":"postregistration_success"}));
                		}
            		})
            		connection.release(console.log("postregistration connection released!"));
        		};
    		});	
	    });

	// post user location
	}else if (parsedUrl.pathname === "/postlocation") {
		req.on('data', function (data){
	  		responseString += data;
	  	});
	  	req.on('end', function(){
	  		var responseObject = JSON.parse(responseString);
	  		console.log("postlocation request recieved.");
	  		//var dateToday = new Date(responseObject.timestamp);
	  		
	  		pool.getConnection(function(err, connection){
        		if (err){
            		throw err;
        		}else{
        			//include uuid for smartphones
            		connection.query("INSERT INTO location VALUES ('myexampleuuid'," + responseObject.latitude + 
            						 "," + responseObject.longitude + "," + responseObject.accuracy + "," + 
            						 responseObject.timestamp + ")", function(err, rows){
                		if (err) {
                    		throw err;
                		}else{
                    		console.log("postlocation SQL Query finished.");
                    		res.writeHead(200, { 'Content-Type': 'application/json', 
	    						'Access-Control-Allow-Origin': '*',
	    						'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify({"response" : "postlocation_success"}));
                		}
            		})
            		connection.release(console.log("postlocation connection released!"));
        		};
    		});
	    });

	// get info for registered users
	}else if (parsedUrl.pathname === "/getregistered"){
	   	res.writeHead(200, { 'Content-Type': 'application/json', 
    		'Access-Control-Allow-Origin': '*',
    		'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end(JSON.stringify(user));
	
	// get contacts location data
	}else if (parsedUrl.pathname === "/getcontacts"){
	   	//req.on('end',function(){

	   		console.log("'getcontacts' request recieved.");

	   		pool.getConnection(function(err, connection){
        		if (err){
            		throw err;
        		}else{
            		connection.query("SELECT s1.vorname, s1.nachname, s2.latitude, s2.longitude, s2.timestamp from user s1 inner join (select uuid, latitude, longitude, max(timestamp) as timestamp from location group by uuid) as s2 on s1.uuid=s2.uuid where s1.uuid <> 'myexampleuuid' and s1.regcode = 'codeSQL'", function(err, rows){
                		if (err) {
                    		throw err;
                		}else{
                    		console.log("'getcontacts' SQL Query finished.");
                    		res.writeHead(200, { 'Content-Type': 'application/json', 
	    						'Access-Control-Allow-Origin': '*',
	    						'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify(rows));
                		}
            		})
            		connection.release(console.log("'getcontacts' connection released!"));
        		};
    		});
	   	//})
	//api not found
	} else {
		res.writeHead(404, { 'Content-Type': 'application/json', 
	    	'Access-Control-Allow-Origin': '*',
	    	'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    res.end();
	}
});

server.listen(8000);
console.log("Server is running.");