const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    created_at: {
        type: Number,
        required: true,
    },
    updated_at: {
        type: Number,
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
    email_verified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: "creator" | "editor",
    },
});

module.exports = mongoose.model("User", userSchema);
