const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));



mongoose.connect('mongodb://localhost:27017/wikiDB'); //local database connection

const articleSchema = { //Schema for database
  title: "String",
  content: "String"
};

const Article = mongoose.model("Article", articleSchema); // collections

////////////////////////////////////////////////Routes for all articles present//////////////////////////////////////////////

app.route("/articles")     //making routes

  .get(function(req, res) {
    Article.find(function(err, results) {
      if (err)
        console.log(err);
      else
        res.send(results);
    });
  })


  .post(function(req, res) {
    const newarticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newarticle.save();
    res.redirect("/articles");
  })


  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err)
        console.log(err);
      else
        console.log("Deleted sucessfully");
    });
  });



app.route("/articles/:inputArticle")
.get(function(req,res){
   Article.findOne({title: req.params.inputArticle},function(err,founditem){
     if(founditem){
       res.send(founditem);
     }
     else{
       res.send("Article not found");
     }
   });
})
.put(function(req,res){
    Article.updateOne(
      {title: req.params.inputArticle},
      {title: req.body.title, content: req.body.content},
      function(err){
      if(!err){
      res.send("Sucessfuly updated");
    }
    else{
      res.send(err);
    }
    });
})
.patch(function(req,res){
    Article.updateOne({title: req.params.inputArticle},
      {$set: req.body},
    function(err){
      if(!err)
      res.send("updated Sucessfully");
      else
      res.send(err);
    });
})
.delete(function(req,res){
  Article.deleteOne({title: req.params.inputArticle},
  function(err){
    if(!err){
      res.send("deleted sucessfully");
    }
    else
    res.send(err);
  });
});




app.listen(3000, function(req, res) {
  console.log("Server is up and running");
});
