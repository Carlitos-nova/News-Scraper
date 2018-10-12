const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const artSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    link:{
        type: String,
        required: false
    },
    summary:{
        type: String
    },
    imageLink:{
        type: String
    },
    comments:[{
        type: Schema.Types.ObjectId,
        ref: "Note"   
    }]
})

var article = mongoose.model("article", artSchema);

module.exports = article;