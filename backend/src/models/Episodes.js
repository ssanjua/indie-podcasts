const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const EpisodesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        default: "",
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        default: "audio",
    },
    duration: {
        type: String,
        default: "",
    },
    file: {
        type: String,
        default: "",
    },
},
    { timestamps: true,
     }
);

module.exports = mongoose.model("Episodes", EpisodesSchema);