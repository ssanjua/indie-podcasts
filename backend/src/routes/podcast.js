const express = require('express')
const { verifyToken } = require ('../middleware/verifyToken.js');
const { 
  addView, 
  addepisodes, 
  createPodcast, 
  favoritPodcast, 
  deletePodcast,
  deleteEpisode,
  getByCategory, 
  getByTag, 
  getPodcastById, 
  getPodcasts, 
  random, 
  search, 
  mostpopular,
  latestPodcast, 
  latestEpisodes,
} = require("../controllers/podcasts.js");

const router = express.Router();

//create a podcast
router.post("/",verifyToken, createPodcast);
//get all podcasts
router.get("/", getPodcasts);
//get podcast by id
router.get("/get/:id",getPodcastById)

//delete a podcast
router.delete("/:id", verifyToken, deletePodcast);

//delte an episode
router.delete("/episode/:id", verifyToken, deleteEpisode);

//add episode 
router.post("/episode",verifyToken, addepisodes);

//favorit/unfavorit podcast
router.post("/favorit",verifyToken,favoritPodcast);

//add view
router.post("/addview/:id",addView); 

//searches
router.get("/mostpopular", mostpopular)
router.get("/random", random)
router.get("/tags", getByTag)
router.get("/category", getByCategory)
router.get("/search", search)
router.get("/latest", latestPodcast)
router.get("/episodes/latest", latestEpisodes)

//edit podcasts and episodes
// router.put("/:id", verifyToken, updatePodcast)
// router.put("/episode/:id", verifyToken, updateEpisode)

module.exports = router;