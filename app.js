var express = require('express')
const fs = require('fs')
const editJsonFile = require('edit-json-file');
require('dotenv').config();

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
    var host = "localhost"
    var port = server.address().port;
    console.log('Example app listening at http://' + host + ':' + port);
  }
    
app.use(express.static('src'));


var io = require('socket.io')(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      transports: ['websocket', 'polling'],
      credentials: true
  }, allowEIO3: true
});
  
io.sockets.on('connection', function (socket) {
  socket.on('req', function() {
    var items = editJsonFile("items.json", {autosave: true})
    
    console.log(items.get("items")) 
    socket.emit("res", items.get("items"))
  });
    

  socket.on("add", function(data) {
    if (process.env.KEY == data.key) {
      var addItems = {
        name: data.name,
        price: data.price,
        desc: data.desc,
        image: data.image,
      }
      var items = editJsonFile("items.json", {autosave: true})
      items.append("items", addItems)
    }
  })

  socket.on("delete", function(data) {
    if(process.env.KEY == data.key) {
      var items = editJsonFile("items.json", {autosave: true})
      console.log("delete", data.item)
      var itemsList = items.get("items")
      items.unset("items")

      itemsList.splice(data.item, data.item)
      items.set("items", itemsList)
    }
  })
});


app.use("/images", express.static("images"))
app.use("/admin", express.static('src-admin'))
app.use("/", express.static('assets'))