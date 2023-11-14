const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
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
    workspaceId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: String,
        required: true,
    },
    status: {
        type: "pending" | "approved" | "rejected",
        default: "pending",
    },
});

module.exports = mongoose.model("Video", videoSchema);
