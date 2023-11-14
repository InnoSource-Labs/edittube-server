const mongoose = require("mongoose");

const workspaceSchema = mongoose.Schema({
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
        default: [],
    },
});

module.exports = mongoose.model("Workspace", workspaceSchema);
