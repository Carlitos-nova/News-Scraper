const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var comSchema = new Schema({
    author:{
        type: String
    },
    body:{
        type:String
    }
});

var note = mongoose.model("note", comSchema);

module.exports = note;