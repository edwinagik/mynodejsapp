var express = require("express");
var app = express();
var _ = require("underscore");
var dot = require('dot-object');

var fs = require("fs");

var multer = require("multer");
var upload = multer({dest: './uploads/'});

var mongojs=require('mongojs');
var db= mongojs('catalogue',['catalogue']);

var mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/images");
var conn = mongoose.connection;

var gfs;

var Grid = require("gridfs-stream");
Grid.mongo = mongoose.mongo;

conn.once("open", function(){
  gfs = Grid(conn.db);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());



  //second parameter is multer middleware.
  app.post("/fileUpload", upload.single("avatar"), function(req, res, next){
      console.log('reached post at the server');
    
    //create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
   var adf=JSON.stringify(req.body);
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname   ,metadata: req.body,
      aliases: adf
       
      
      
    });
      // console.log(writestream); 
     console.log( JSON.stringify(req.body));
     console.log(JSON.parse(adf));

    //
    // //pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    fs.createReadStream("./uploads/" + req.file.filename   )
      .on("end", function(){fs.unlink("./uploads/"+ req.file.filename + req.body.metadata , function(err){res.send("success")})})
        .on("err", function(){res.send("Error uploading image")})
          .pipe(writestream);





  });

  //general response for all documents
 app.get("/fileUpload", function(req, res){
    
  gfs.files.find({  }).toArray(function (err, files) {
   
   //console.log(json(files));
   res.send(JSON.stringify(files));

  });
      
  });

  // sends the image we saved by filename.
  app.get("/fileUpload/:filename", function(req, res){
    console.log(req.params.filename);
      var readstream = gfs.createReadStream({filename: req.params.filename});
      readstream.on("error", function(err){
        res.send("No image found with that title");
      });
      readstream.pipe(res);
      
  });

  // retrieve file by type.
  app.get("/viewType/:type", function(req, res){
    console.log('reading by type');
console.log(req.params.type);
  gfs.files.find({}).toArray(function (err, files) {
   console.log('reading by type inside ..');
 //var result = res.send(JSON.stringify(files));
    var result = JSON.stringify(files);
    var obj = JSON.parse(result)
    //console.log(files);
   // res.send(files);


//console.log(filterBy('Learn'));
//console.log(filterBy('l'))
//console.log(filterBy('wor'))
 


//nodes = db.nodes.find({'metadata.type': req.params.type })
//console.log(nodes);
   //var json = '[{"user": "a", "age": 20}, {"user": "a", "age": 30}, {"user": "c", "age": 40}]';
    var result = JSON.stringify(files);
    var users = JSON.parse(result)



//var filtered = _.where(users, {filename:{type: req.params.type}});
//var x = _.where(test, {metadata:{type:"reb.png"}});

///var filtered = _.where(users, {filename: "database.PNG"});
  //console.log(filtered);
  //  res.send(filtered);
 // console.log('reading filtered ..');


   });
   });

  //delete the image
  app.get("/fileUpload/delete/:filename", function(req, res){
    gfs.exist({filename: req.params.filename}, function(err, found){
      if(err) return res.send("Error occured");
      if(found){
        gfs.remove({filename: req.params.filename}, function(err){
          if(err) return res.send("Error occured");
          res.send("Image deleted!");
        });
      } else{
        res.send("No image found with that title");
      }
    });
  });
});



if (!module.parent) {
  app.listen(3000);
  console.log('listening on port 3000')
}


