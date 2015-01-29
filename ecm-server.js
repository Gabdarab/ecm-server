var http = require("http");
var url = require("url");
var mysql = require('mysql');

var pool = mysql.createPool({
  	host     : 'localhost',
  	user     : 'ecm-server',
  	password : 'mypass',
  	database : 'ecmmobile'
});

var server = http.createServer(function (req, res) {
  	
    console.log(req.url)
  	var parsedUrl = url.parse(req.url, true);
  	var responseString = "";
  	
  	// post user information upon registration
	if(parsedUrl.pathname === "/postregistration"){
	  	
	  	req.on('data', function (data){
	  		responseString += data;
	  	});
	  	
	  	req.on('end', function(){
	  		var responseObject = JSON.parse(responseString);
	  		console.log("'postregistraion' request recieved.");
	  		
	  		pool.getConnection(function(err, connection){
        		
        		if (err){
                    console.log("'postregistration' SQL connection error.");
                    res.writeHead(503, { 'Content-Type': 'application/json', 
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                    res.end(JSON.stringify({"response":"'postregistration' SQL connection error"}));
            		throw err;
        		}else{
        			//include uuid and other device info for smartphones
            		connection.query("INSERT INTO user VALUES ('tempuuid', '" + responseObject.vorname + "', '" + responseObject.nachname + "', '" + responseObject.regcode + "', " + "'devicemodel', 'deviceplatform', 'deviceversion', " + responseObject.timestamp + ")", function(err, rows){
                		
                		if (err) {
                    		console.log("'postregistration' SQL query error.");
                            res.writeHead(500, { 'Content-Type': 'application/json', 
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response":"'postregistration' SQL query error"}));
                            throw err;
                		}else{
                    		console.log("'postregistration' SQL query finished.");
                    		res.writeHead(201, { 'Content-Type': 'application/json', 
	    									'Access-Control-Allow-Origin': '*',
	    									'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					
	    					res.end(JSON.stringify({"response":"'postregistration' success"}));
                		}
            		})
            		
            		connection.release(console.log("'postregistration' connection released!"));
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
	  		console.log("'postlocation' request recieved.");
	  		//var dateToday = new Date(responseObject.timestamp);
	  		
	  		pool.getConnection(function(err, connection){
        		
        		if (err){
                    console.log("'postlocation' SQL connection error.");
                            res.writeHead(503, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'postlocation' SQL connection error"}));
            		throw err;
        		}else{
        			//include uuid for smartphones
            		connection.query("INSERT INTO location VALUES ('myexampleuuid'," + responseObject.latitude + 
            						 "," + responseObject.longitude + "," + responseObject.accuracy + "," + 
            						 responseObject.timestamp + ")", function(err, rows){
                		if (err) {
                    		console.log("'postlocation' SQL query error.");
                            res.writeHead(500, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'postlocation' SQL query error"}));

                            throw err;
                		}else{
                    		console.log("'postlocation' SQL query finished.");
                    		res.writeHead(201, { 'Content-Type': 'application/json', 
	    						'Access-Control-Allow-Origin': '*',
	    						'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify({"response" : "'postlocation' success"}));
                		}
            		})
            		
            		connection.release(console.log("'postlocation' connection released!"));
        		};
    		});
	    });

	// get info for registered users
	}else if (parsedUrl.pathname === "/getregistered"){
	   	
	   	console.log("'getregistered' request recieved.");

	   		pool.getConnection(function(err, connection){
        		if (err){
                    console.log("'getregistered' SQL connection error.");
                    res.writeHead(503, { 'Content-Type': 'application/json', 
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers' : 'Content-Type'
                    });
                    res.end(JSON.stringify({"response" : "'getregistered' SQL connection error"}));

            		throw err;
        		}else{
            		
            		connection.query("SELECT vorname, nachname, regcode FROM user WHERE uuid ='" + parsedUrl.query.uuid + "'", function(err, rows){
                		if (err) {
                            console.log("'getregistered' SQL query error.");
                            res.writeHead(500, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'getregistered' SQL query error"}));

                    		throw err;
                		}else{
                    		console.log("'getregistered' SQL Query finished.");
                    		res.writeHead(200, { 'Content-Type': 'application/json', 
    							'Access-Control-Allow-Origin': '*',
    							'Access-Control-Allow-Headers' : 'Content-Type'
	    					});
	    					res.end(JSON.stringify(rows));
                		}
            		})
            		
            		connection.release(console.log("'getregistered' connection released!"));
        		};
    		});
	
	// get contacts location data
	}else if (parsedUrl.pathname === "/getcontacts"){
	   	
	   		console.log("'getcontacts' request recieved.");

	   		pool.getConnection(function(err, connection){
        		if (err){
                    console.log("'getcontacts' SQL connection error.");
                    res.writeHead(503, { 'Content-Type': 'application/json', 
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Headers' : 'Content-Type'
                    });
                    res.end(JSON.stringify({"response" : "'getcontacts' SQL connection error"}));

            		throw err;
        		}else{
            		
            		connection.query("SELECT s1.vorname, s1.nachname, s2.latitude, s2.longitude, s2.timestamp FROM user s1 INNER JOIN (SELECT uuid, latitude, longitude, max(timestamp) AS timestamp FROM location GROUP BY uuid) AS s2 ON s1.uuid=s2.uuid WHERE s1.uuid <> 'myexampleuuid' AND s1.regcode = '" + parsedUrl.query.regcode + "'", function(err, rows){
                		if (err) {
                    	    console.log("'getregistered' SQL query error.");
                            res.writeHead(500, { 'Content-Type': 'application/json', 
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers' : 'Content-Type'
                            });
                            res.end(JSON.stringify({"response" : "'getregistered' SQL query error"}));

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
	   	
	//api not found
	}else{
		res.writeHead(404, { 'Content-Type': 'application/json', 
	    	'Access-Control-Allow-Origin': '*',
	    	'Access-Control-Allow-Headers' : 'Content-Type'
	    });
	    
	    res.end(JSON.stringify({"response" : "URL not found"}));

	}
});

server.listen(8000);
console.log("Server is running.");
