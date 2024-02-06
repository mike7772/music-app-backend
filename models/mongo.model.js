const mongoose = require("mongoose")

// Instantiating mongodb schema using mongoose orm
const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true, 
  },
  album: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports =  mongoose.model("Song", SongSchema);
