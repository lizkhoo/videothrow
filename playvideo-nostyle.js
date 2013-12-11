// Use the http module: http://nodejs.org/api/http.html
var http = require('http');
var url = require('url');
var formidable = require('formidable');
var sys = require('sys');
var querystring = require('querystring');
var fs = require('fs');
var current = 0;
var videosrc = '';
var fileArray = new Array();
var storagepath = "storage/";

function requestHandler(req, res){

	if(req.url == '/upload' && req.method.toLowerCase() == 'post') {

		console.log("Request handler 'upload' was called");
		var form = new formidable.IncomingForm();

		fs.readdir(storagepath, function(err, files){
				if (err) throw err;
				current = files.length + 1;
				console.log("files array:" + files);
			
		});

		console.log("about to parse");
		form.parse(req, function(error, fields, files){
			console.log("parsing done");


            console.log("current file: " + storagepath + current +'.mp4');
            //rename the file and save it
			fs.rename(files.upload.path, storagepath + current +'.mp4', function(error){
				if (error) {
					fs.unlink(storagepath + current +'.mp4');
					fs.rename(files.upload.path, storagepath + current +'.mp4');
				}
			console.log("rename and save complete");
			});

			//turn file into a readable stream and writes to to HTTP response using .pipe
			//var stream = fs.createReadStream(storagepath + current +'.mp4').pipe(res);

			res.writeHead(200, {"Content-Type": "text/html"});
			res.write("received videos:<br/>");

			//read the storagepath folder and return all files as an array
			fs.readdir(storagepath, function(err, files){
				if (err) throw err;
				for (var i = 0; i < files.length; i++){
					fileArray.push(files[i]);
				}

				var whatsthis = fileArray.length;
				console.log("whats this:" + whatsthis);

			for (var i = fileArray.length; i > 0; i--){
				console.log("inside fileArray loop " + fileArray[i-1]);
				res.write("<video id='video"+ i + "' controls><source src='" + fileArray[i-1] + "'></video>");

			}
					res.end();

			});
				
		
		});
	} else if (req.url == "/") {
	// show a file upload form
	res.writeHead(200, {'content-type': 'text/html'});
	res.end(
		'<form action="/upload" enctype="multipart/form-data" '+ 'method="post">' +
		'<input type="file" name="upload" multiple="multiple"><br>' +
		'<input type="submit" value="Upload an MP4">' +
		'</form>'
		);
	
	}

	 else  {
	 	//display files located in storage folder
	 	console.log("Going to read and send: " + "storage" + req.url);
		fs.readFile("storage" + req.url, 
			// Callback function for reading
			function (err, data) {
			// if there is an error
			if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
			}
		);
	}
  }

var httpServer = http.createServer(requestHandler);

httpServer.listen(7171);

console.log('server listening on 7171');
