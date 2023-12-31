const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    updatedAt: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    nickname: String,
    picture: String,
});

module.exports = mongoose.model("User", userSchema);
