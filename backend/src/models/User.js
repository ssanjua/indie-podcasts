const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    img: {
        type: String,
        default: "",
    },
    googleSignIn:{
        type: Boolean,
        required: true,
        default: false,
    },
    podcasts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    },
    favorits: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Podcasts",
        default: [],
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);