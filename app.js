
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const mongo = require('mongoose');
const Schema = mongo.Schema;
const multer = require('multer');
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

var uri = 'mongodb+srv://MindBenders:MindBenders123@cluster0.txfw7.mongodb.net/students?retryWrites=true&w=majority';
mongo.connect(uri, {useNewUrlParser: true,useUnifiedTopology:true}); 
const connection = mongo.connection;
connection
  .once('open', () => {
    console.log("mongoDB database connection established");
  })
  .on('error', err => {
    console.log('Error:', err);
  });

const schema = {
  name: {type: mongo.SchemaTypes.String},
  email: {type: mongo.SchemaTypes.String},
  dataUrl: {type: mongo.SchemaTypes.String, required:true}
};
const collectionName = "Notes";
const collabSchema = mongo.Schema(schema);
const collab = mongo.model(collectionName, collabSchema);


app.use(express.static(__dirname + '/public'));

function onConnection(socket){
  socket.on('drawing', function(data){
    socket.broadcast.emit('drawing', data);
    console.log(data);
  });
  
  socket.on('rectangle', function(data){
    socket.broadcast.emit('rectangle', data);
    console.log(data);
  });
  
  socket.on('linedraw', function(data){
    socket.broadcast.emit('linedraw', data);
    console.log(data);
  });
  
   socket.on('circledraw', function(data){
    socket.broadcast.emit('circledraw', data);
    console.log(data);
  });
  
  socket.on('ellipsedraw', function(data){
    socket.broadcast.emit('ellipsedraw', data);
    console.log(data);
  });
  
  socket.on('textdraw', function(data){
    socket.broadcast.emit('textdraw', data);
    console.log(data);
  });
  
  socket.on('copyCanvas', function(data){
    socket.broadcast.emit('copyCanvas', data);
    console.log(data);
  });
  
  socket.on('Clearboard', function(data){
    socket.broadcast.emit('Clearboard', data);
    console.log(data);
  });

  socket.on('erase', function(data){
    socket.broadcast.emit('erase', data);
    console.log(data);
  });

  let current_datetime = new Date();
  let formatted_date = current_datetime.getDate() + "-" +  (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear();
 
  socket.on('dataurl',function(data) {
    var newNotes = new collab({
      name: formatted_date,
      email: "default@gmail.com",
      dataUrl: `${data}`
    });
    newNotes.save((err,Collab)=>{
      if(err) throw err
      console.log("you added a note",Collab);
    })
  });
}



io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
