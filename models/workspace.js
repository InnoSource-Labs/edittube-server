const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({
    id: {
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
    editorIds: {
        type: [String],
        required: true,
        default: [],
    },
});

module.exports = mongoose.model("Workspace", workspaceSchema);
