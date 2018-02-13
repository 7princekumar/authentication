var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password: String
});

//add bunch of methods(for authentication) that come with passportLocalMongoose to this schema
//methods like - serialise and deserialise (for encoding and decoding)
UserSchema.plugin(passportLocalMongoose);
module.exports =  mongoose.model("User", UserSchema);