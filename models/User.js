const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   first_name: String,
   last_name: String,
   username: {type: String, text: true},
   password: String,
   email: String,
   gender: String,
   profileImage: Object || undefined,
   uploads: Array, // array of objects({id, contentType, uploadDate, cash, hearts, base64})
   following: Array, // array of user_id
   followers: Array, // array of user_id
   cash: Number,
   cash_earned: Number,
   hearts: Number,
   hearts_earned: Number,
   conversations: Array, // array of conversation_id
   keywords: {type: Array, text: true}, // array of strings
   live: String || undefined,
   // story: Array || undefined // array of objects({id, contentType, uploadDate, cash, hearts, base64})
   lastContentUpdate: Date,
   limit_of_contents: { type: Number, default: 9 },
   secrets: Array,
   country: String || undefined,
   date_of_birth: Date || undefined
});
userSchema.index({username: "text", keywords: "text"});
const User = mongoose.model('Users', userSchema);

// const User = mongoose.model('Users',
//  {
//    username: String,
//    password: String,
//    email: String,
//    gender: String,
//    profileImage: Object,
//    uploads: Array, // array of objects({id, contentType, uploadDate, cash, hearts})
//    following: Array, // array of user_id
//    followers: Array, // array of user_id
//    cash: Number,
//    hearts: Number,
//    conversations: Array, // array of conversation_id
//    keywords: Array, // array of strings
//   //  actions: Array, // array of objects({type, user, emoji?})
//    live: String || undefined,
//    story: Array || undefined // array of file_id
//  });

 module.exports=User;
