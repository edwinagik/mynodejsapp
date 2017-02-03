var express=require('express');
var app=express();
var mongojs=require('mongojs');
var db= mongojs('catalogue',['catalogue']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());

app.get('/getdocView', function  (req,res) {
	console.log("i received get request")

  db.catalogue.find(function(err,doc){
	res.json(doc);
	console.log(doc);
  });
});


app.post('/uploadDocs',function(req,res){
	console.log(req.body);
	db.catalogue.insert(req.body,function(err,docs){
		res.json(docs);
	});
});

app.delete('/uploadDocs/:id',function(req,res){
	db.catalogue.insert(req.body,function(err){
		var id=req.params.id;
		console.log(id);
		db.catalogue.remove({_id:mongojs.ObjectId(id)},function(err,docs){
			res.json(docs);
		})
	})
});


app.get('/uploadDocs/:id',function(req,res){
	var id=req.params.id;
	console.log(id);
	db.catalogue.findOne({_id:mongojs.ObjectId(id)},function(err,docs){
			res.json(docs);
		})
	
})


app.put('/uploadDocs/:id',function(req,res){
        var id=req.params.id;
		console.log(id);
		db.catalogue.findAndModify({query:{_id: mongojs.ObjectId(id)},
	update: {$set: {name: req.body.name,email: req.body.email,number:req.body.number}},
    new:true},function(err,doc){
			res.json(doc);
			console.log(req.body.name);
		})
	
});


app.listen(3000);
console.log("server listening on port 3000");
 