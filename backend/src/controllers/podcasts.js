const mongoose = require("mongoose");
const User = require("../models/User.js");
const { createError } = require("../error.js");
const Podcasts = require("../models/Podcasts.js");
const Episodes = require("../models/Episodes.js");

exports.createPodcast = async (req, res, next) => {
  // console.log("Received data from frontend:", req.body)
  try {
    const user = await User.findById(req.user.id);

    let episodeList = []
    await Promise.all(req.body.episodes.map(async (item) => {
      try {
        const episode = new Episodes({ creator: user.id, ...item });
        const savedEpisode = await episode.save();
        episodeList.push(savedEpisode._id);
      } catch (err) {
        // console.error("Error saving episode:", err);
        throw err;  // Rethrow the error to handle it in the outer catch
      }
    }));

    // Create a new podcast
    const podcast = new Podcasts(
      {
        creator: user.id,
        episodes: episodeList,
        name: req.body.name,
        desc: req.body.desc,
        thumbnail: req.body.thumbnail,
        tags: req.body.tags,
        type: req.body.type,
        category: req.body.category
      }
    );
    const savedPodcast = await podcast.save();
    // console.log("Request Body:", req.body)

    //save the podcast to the user
    await User.findByIdAndUpdate(user.id, {
      $push: { podcasts: savedPodcast.id },
    }, { new: true });

    res.status(201).json(savedPodcast);
  } catch (err) {
    console.error(err)
    next(err);
  }
};

exports.addepisodes = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body)
    const user = await User.findById(req.user.id);
    console.log("User Found:", user)

    await Promise.all(req.body.map(async (item) => {

      const episode = new Episodes(
        { creator: user.id, ...item });
      console.log("Episode to be saved:", episode)

      const savedEpisode = await episode.save();
      console.log("Saved Episode:", savedEpisode)

      console.log("podId:", item.podId)

      // Convert `podId` to ObjectId
      // const podcastId = mongoose.Types.ObjectId(item.podId);

      // Try to update the podcast
      const updatedPodcast = await Podcasts.findByIdAndUpdate(
        item.podId,
        { $push: { episodes: savedEpisode.id } },
        { new: true }
      )

      console.log("Updated Podcast:", updatedPodcast)
    }));

    res.status(201).json({ message: "Episode added successfully" });

  } catch (err) {
    console.error("Error:", err)
    next(err);
  }
}

exports.getPodcasts = async (req, res, next) => {
  try {
    // Get all podcasts from the database
    const podcasts = await Podcasts.find().populate("creator", "name img").populate("episodes");
    return res.status(200).json(podcasts);
  } catch (err) {
    next(err);
  }
};

exports.getPodcastById = async (req, res, next) => {
  try {
    // Get the podcasts from the database
    const podcast = await Podcasts.findById(req.params.id).populate("creator", "name img").populate("episodes");
    return res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

exports.favoritPodcast = async (req, res, next) => {
  // Check if the user is the creator of the podcast
  const user = await User.findById(req.user.id);
  const podcast = await Podcasts.findById(req.body.id);
  let found = false;
  if (user.id === podcast.creator) {
    return next(createError(403, "You can't favorit your own podcast!"));
  }

  // Check if the podcast is already in the user's favorits
  await Promise.all(user.favorits.map(async (item) => {
    if (req.body.id == item) {
      //remove from favorite
      found = true;
      console.log("this")
      await User.findByIdAndUpdate(user.id, {
        $pull: { favorits: req.body.id },

      }, { new: true })
      res.status(200).json({ message: "Removed from favorit" });

    }
  }));

  if (!found) {
    await User.findByIdAndUpdate(user.id, {
      $push: { favorits: req.body.id },

    }, { new: true });
    res.status(200).json({ message: "Added to favorit" });
  }
}

//add view 
exports.addView = async (req, res, next) => {
  try {
    await Podcasts.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

//searches
exports.random = async (req, res, next) => {
  try {
    const podcasts = await Podcasts.aggregate([{ $sample: { size: 40 } }]).populate("creator", "name img").populate("episodes");
    res.status(200).json(podcasts);
  } catch (err) {
    next(err);
  }
};

exports.mostpopular = async (req, res, next) => {
  try {
    const podcast = await Podcasts.find().sort({ views: -1 }).populate("creator", "name img").populate("episodes");
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

exports.getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  try {
    const podcast = await Podcasts.find({ tags: { $in: tags } }).populate("creator", "name img").populate("episodes");
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

exports.getByCategory = async (req, res, next) => {
  const query = req.query.q;
  try {
    const podcast = await Podcasts.find({

      category: { $regex: query, $options: "i" },
    }).populate("creator", "name img").populate("episodes");
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const podcast = await Podcasts.find({
      name: { $regex: query, $options: "i" },
    }).populate("creator", "name img").populate("episodes").limit(40);
    res.status(200).json(podcast);
  } catch (err) {
    next(err);
  }
};