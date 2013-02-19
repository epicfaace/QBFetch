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
	var html=false;
	var routes=["/","/chat","/pong","/3dgame"];
	var fileNames=["./index.html","./drawChat.html","./pong.html","./3dgame.html"];
	if (routes.indexOf(url) != -1) { //found in array of fileNames
		url=fileNames[routes.indexOf(url)];
		html=true;
	}
	else {
		url="."+url;
	}
	fs.readFile(url,/*"utf8",*/ function (err, data) { //utf8 soporta tildes - o ¿no?
		//res.charset="utf8";
		if (err) {
			res.writeHead(500);
			//console.log(err);
			var final = String(err);
			if (html) final='<p>'+lastUpdate+'</p>'+final;
			return res.end(final);
		}
		res.writeHead(200);
		var final = data;
		if (html) final='<p>'+lastUpdate+'</p>'+final;
		res.end(data);
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
		socket.broadcast.emit('movement',data); //change(d) to broadcast
	});
  //socket.on('')
});
var threedgameHandler=io.of('/3dgameHandler')
.on('connection', function (socket) {
/*	socket.emit goes to custom handler, socket.send goes to 'message' handler
	socket.emit (or send) goes to only the user who sent the message;
		chatHandler (or var name) .emit/send goes to all users
*/
	//socket.send('welcome!');

	socket.on('message',function(data) {
		socket.send(data);
	});
	socket.on('playerPos',function(data) {
		socket.broadcast.emit('playerPos',{x:data.x,y:data.y,z:data.z}); //change(d) to broadcast
	});
  //socket.on('')
});