//TODO: http requests for articles from server
$(document).ready(function(){
    //get request from server from db for articles
    $.get("/scrape",function(data){
        console.log(data);
    })
})