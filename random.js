 http = require("http");


 http.get("https://api.random.org/json-rpc/1/invoke", function(res) {
	console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
	console.log("Got error: " + e.message);
});