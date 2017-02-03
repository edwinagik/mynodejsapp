var express=require('express');
var app=express();
var mongojs=require('mongojs');
var db= mongojs('mydb',['mydb']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public/"));
app.use(bodyParser.json());

app.get('/mycontacts', function  (req,res) {
	console.log("i received get request")

  db.mydb.find(function(err,doc){
	res.json(doc);
  });
});

app.post('/mycontacts',function(req,res){
	console.log(req.body);
	db.mydb.insert(req.body,function(err,docs){
		res.json(docs);
	});
});

app.delete('/mycontacts/:id',function(req,res){
	db.mydb.insert(req.body,function(err){
		var id=req.params.id;
		console.log(id);
		db.mydb.remove({_id:mongojs.ObjectId(id)},function(err,docs){
			res.json(docs);
		})
	})
});


app.get('/mycontacts/:id',function(req,res){
	var id=req.params.id;
	console.log(id);
	db.mydb.findOne({_id:mongojs.ObjectId(id)},function(err,docs){
			res.json(docs);
		})
	
})


app.put('/mycontacts/:id',function(req,res){
        var id=req.params.id;
		console.log(id);
		db.mydb.findAndModify({query:{_id: mongojs.ObjectId(id)},
	update: {$set: {name: req.body.name,email: req.body.email,number:req.body.number}},
    new:true},function(err,doc){
			res.json(doc);
			console.log(req.body.name);
		})
	
});


app.listen(3000);
console.log("server listening on port 3000");
 