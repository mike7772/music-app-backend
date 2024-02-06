const Song = require("../models/mongo.model");

const createSong = async (req, res) => {
  // Handle the logic for creating a song
  const { title, artist, album, genre,imgUrl,description } = req.body;
  const checkSong = await Song.findOne({ title }); // retrieves the users data from the database
  if (checkSong) {
    return res
      .status(500)
      .send({ message: "This song has already been registered." });
  }

  const song = new Song({ title, artist, album, genre }); // adding data to the database
  await song.save();
  return res.status(200).send({ message: "Song Created Successfully" });
};

const getSong = async (req, res) => {
  // Handle the logic for getting a song
  const { title } = req.params;

  if (!title) {
    return res
      .status(400)
      .json({ message: "Title is required for accessing the song" });
  }

  const getSong = await Song.findOne({ title }); // retrieves the users data from the database
  if (getSong) {
    return res.status(200).send({ message: "Success", data: getSong });
  }

  return res.status(500).send({ message: "Couldn't find the song" });
};

const listSongs = async (req, res) => {
  // Handle the logic for listing songs
  const allSongs = await Song.find();
  return res.status(200).send({ message: "Success", data: allSongs });
};

const listArtist = async (req, res) => {
  // Handle the logic for getting list of artists
  const getList = await Song.aggregate([
    {
      $group: {
        _id: "$artist",
        count: { $sum: 1 },  // Count of songs for each artist
      },
    },
  ]);

  return res.status(200).send({ message: "Success", data: getList });

};

const listAlbum = async (req, res) => {
  // Handle the logic for getting list of artists
  const getList = await Song.aggregate([
    {
      $group: {
        _id: "$album",
        count: { $sum: 1 },  // Count of songs for each artist
      },
    },
  ]);

  return res.status(200).send({ message: "Success", data: getList });

};

const listGenre = async (req, res) => {
  // Handle the logic for getting list of artists
  const getList = await Song.aggregate([
    {
      $group: {
        _id: "$genre",
        count: { $sum: 1 },  // Count of songs for each artist
      },
    },
  ]);

  return res.status(200).send({ message: "Success", data: getList });

};
const getSongStatistics = async (req, res) => {
  // Handle the logic for getting stats

  try {
    // Total # of songs
    const totalSongs = await Song.countDocuments();

    // Total # of artists
    const totalArtists = await Song.distinct("artist").count();

    // Total # of albums
    const totalAlbums = await Song.distinct("album").count();

    // Total # of genres
    const totalGenres = await Song.distinct("genre").count();

    // # of songs in every genre
    const songsInGenre = await Song.aggregate([
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
        },
      },
    ]);

    // # of songs & albums each artist has
    const songsPerArtist = await Song.aggregate([
      {
        $group: {
          _id: "$artist",
          totalSongs: { $sum: 1 },
          totalAlbums: { $addToSet: "$album" },
        },
      },
    ]);

    // Songs in each album
    const songsInAlbum = await Song.aggregate([
      {
        $group: {
          _id: "$album",
          songs: { $push: "$title" },
        },
      },
    ]);

    // console.log("Total # of songs:", totalSongs);
    // console.log("Total # of artists:", totalArtists);
    // console.log("Total # of albums:", totalAlbums);
    // console.log("Total # of genres:", totalGenres);
    // console.log("# of songs in every genre:", songsInGenre);
    // console.log("# of songs & albums each artist has:", songsPerArtist);
    // console.log("Songs in each album:", songsInAlbum);

    return res.status(200).json({ message: "successful", data: {totalSongs,totalArtists,totalAlbums,totalGenres, songsInGenre, songsPerArtist, songsInAlbum} });
  } catch (error) {
    console.error(error);
    return res
    .status(500)
    .json({ message: "Something went wrong" });
  }
};

const updateSong = async (req, res) => {
  // Handle the logic for updating a song
  const { title } = req.params;
  const { genre, album, artist,imgUrl,description } = req.body;
  const updateObject = {};

  if (!title) {
    return res
      .status(400)
      .json({ message: "Title is required for updating the song" });
  }

  // Construct the update object with non-null fields
  if (genre !== null && genre !== undefined) updateObject.genre = genre;
  if (album !== null && album !== undefined) updateObject.album = album;
  if (artist !== null && artist !== undefined) updateObject.artist = artist;
  if (imgUrl !== null && imgUrl !== undefined) updateObject.imgUrl = imgUrl;
  if (description !== null && description !== undefined) updateObject.description = description;


  const song = await Song.findOneAndUpdate({ title }, updateObject, {
    new: true,
  });

  if (song) {
    return res
      .status(200)
      .json({ message: "Song updated successfully", data: song });
  }
  return res
    .status(404)
    .json({ message: "Song not found with the specified title" });
};

const deleteSong = async (req, res) => {
  // Handle the logic for deleting a song
  const { title } = req.params;

  if (!title) {
    return res
      .status(400)
      .json({ message: "Title is required for deleting the song" });
  }

  const song = await Song.findOne({ title });

  if (!song) {
    return res
      .status(400)
      .json({ message: "No song registered with this Title" });
  }
  await Song.deleteOne({ title });

  return res.status(200).json({ message: "Song deleted successfully" });
};

module.exports = {
  createSong,
  getSong,
  listSongs,
  listArtist,
  listAlbum,
  listGenre,
  getSongStatistics,
  updateSong,
  deleteSong,
  // Add other controller functions here
};
