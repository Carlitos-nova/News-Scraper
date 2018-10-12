const express = require("express");
var note = require("../models/Note.js");
var article = require("../models/Article.js");
var app = express();
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
                console.log("all article with notes: " + doc);
                res.render("index", { articles: doc });
            }
        });



});

app.get("/",function(req,res){
    article.find({}, function(err,doc){
        if(err){
            console.log(err)
        }else{
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
            article.findOne({ title: result.arTitle }, function (err, data) {
                if (!data) {
                    var entry = new article(result);
                    entry.save(function (err, doc) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(`saving ${doc.title}`);
                        }
                    })
                } else {
                    console.log(`${doc.title} has already been saved`);
                }
            })
        })
        console.log(results);
    })
})