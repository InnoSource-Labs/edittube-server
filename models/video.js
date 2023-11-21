const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    created_at: {
        type: String,
        required: true,
    },
    updated_at: {
        type: String,
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
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
        required: true,
    },
});

module.exports = mongoose.model("Video", videoSchema);
