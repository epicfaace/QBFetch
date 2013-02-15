var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(90);
var currentdate=new Date();
var lastUpdate=  currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
function handler (req, res) {
	var url=req.url;
	var routes=["/","/chat","/pong"];
	var fileNames=["./index.html","./drawChat.html","./pong.html"]
	if (routes.indexOf(url) === -1) return req.url;
	url=fileNames[routes.indexOf(url)];
	fs.readFile(url,"utf8", function (err, data) { //utf8 soporta tildes - o ¿no?
		res.charset="utf8";
		if (err) {
			res.writeHead(500);
			//console.log(err);
			return res.end('<p>'+lastUpdate+'</p>'+String(err));
		}
		res.writeHead(200);
		res.end('<p>'+lastUpdate+'</p>'+data);
	});
}

var allData=[];

var chatHandler=io.of('/chatHandler')
.on('connection', function (socket) {
/*	socket.emit goes to custom handler, socket.send goes to 'message' handler
	socket.emit (or send) goes to only the user who sent the message;
		chatHandler (or var name) .emit/send goes to all users
*/
	for (x in allData) {
		chatHandler.emit('image',allData[x]);
	}

	socket.on('message',function(data) {
		chatHandler.send(data);
	});
	socket.on('image',function(data) {
		allData.push(data);
		chatHandler.emit('image',data);
	});
	socket.on('eraseAll',function(data) {
		allData=[];
		chatHandler.emit('eraseAll',data);
	});
  //socket.on('')
});

var pongHandler=io.of('/pongHandler')
.on('connection', function (socket) {
/*	socket.emit goes to custom handler, socket.send goes to 'message' handler
	socket.emit (or send) goes to only the user who sent the message;
		chatHandler (or var name) .emit/send goes to all users
*/
	//socket.send('welcome!');

	socket.on('message',function(data) {
		socket.send(data);
	});
	socket.on('movement',function(data) {
		socket.broadcast.emit('movement',data); //change to broadcast
	});
  //socket.on('')
});