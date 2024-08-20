const express = require('express')
const { verifyToken } = require ("../middleware/verifyToken.js");
const { getUser } = require ("../controllers/user.js");

const router = express.Router();

//get  user
router.get("/",verifyToken, getUser);

module.exports = router;