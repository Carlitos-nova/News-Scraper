const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars")
var PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var note = require("./models/Note.js");
var article = require("./models/Article.js");

var cheerio = require("cheerio");
var request = require("request");

app.get("/", function (req, res) {

  article.find({})
    .populate("note")
    .exec(function (error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        console.log("All article with notes: " + doc);
        res.render("index", { articles: doc });
      }
    });



});

app.get("/", function (req, res) {
  article.find({}, function (err, doc) {
    if (err) {
      console.log(err)
    } else {
      res.json(doc);
    }
  })
})

app.get("/scrape", function (req, res) {
  request("https://www.nytimes.com/section/world", function (error, respons, html) {

    const $ = cheerio.load(html);
    var results = [];
    $(".headline").each(function (i, element) {
      var arTitle = $(element).text();
      var arLink = $(element).children().attr("href");
      results.push({
        title: arTitle,
        link: arLink
      });
      article.create(results)
        .then(function (info) {
          console.log(info.title)
          senddb(info);
        })
        .catch(function (err) {
          console.log(err);
        })
    })
  })
  function senddb(){
    article.find({},function(err,data){
      if(err){
        throw err;
      }else{
        res.json(data);
      }
    })
  }
})

// Listen on the port
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});