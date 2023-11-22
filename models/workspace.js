const mongoose = require("mongoose");

const editorsSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
});

const workspaceSchema = new mongoose.Schema({
    name: {
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
    creatorId: {
        type: String,
        required: true,
    },
    clientId: {
        type: String,
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    editors: {
        type: [editorsSchema],
        required: true,
        default: [],
    },
});

module.exports = mongoose.model("Workspace", workspaceSchema);
