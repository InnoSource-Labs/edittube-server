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
        required: true,
        default: false,
    },
    role: {
        type: "creator" | "editor",
        required: true,
        default: "editor",
    },
});

module.exports = mongoose.model("User", userSchema);
