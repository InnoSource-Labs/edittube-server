const Video = require("../models/video");
const {
    uploadToCloudinary,
    deleteFromCloudinary,
} = require("../utils/cloudinary");
const { getTimeStampString } = require("../utils/healper");
const {
    getHasWorkspaceOwnership,
    getHasWorkspaceEditorship,
} = require("./workspace");

const limit = 5;

async function getHasVideoOwnership(id, uid) {
    const video = await Video.findById(id);
    return !!video && video.uploadedBy === uid;
}

async function getVideos(workspaceId, uid, filter, page) {
    const isOwner = await getHasWorkspaceOwnership(workspaceId, uid);
    const isEditor = await getHasWorkspaceEditorship(workspaceId, uid);
    if (!isEditor || !isOwner) return { status: 401, video: null };

    const query = { workspaceId };
    if (["pending", "approved", "rejected"].includes(filter)) {
        query.status = filter;
    }
    if (isEditor) {
        query.uploadedBy = uid;
    }

    const videos = await Video.find(query)
        .sort("-updatedAt")
        .skip((page - 1) * limit)
        .limit(limit);

    const totalresults = await Video.countDocuments(query);

    return {
        currentpage: page,
        videos,
        totalpages: Math.ceil(totalresults / limit),
    };
}

async function addNewVideo(title, description, videoBuffer, workspaceId, uid) {
    const isEditor = await getHasWorkspaceEditorship(workspaceId, uid);
    if (!isEditor) return { status: 401, video: null };

    const res = await uploadToCloudinary(videoBuffer);
    if (!res.secure_url || !res.public_id) return { status: 500, video: null };
    const timestamp = getTimeStampString();
    const newVideo = new Video({
        workspaceId,
        title,
        description,
        url: res.secure_url,
        cloudinaryId: res.public_id,
        createdAt: timestamp,
        updatedAt: timestamp,
        uploadedBy: uid,
        status: "pending",
    });
    await newVideo.save();

    return {
        status: 201,
        video: newVideo,
    };
}

async function getOneVideo(workspaceId, videoId, uid) {
    const isOwner = await getHasWorkspaceOwnership(workspaceId, uid);
    const isEditor = await getHasWorkspaceEditorship(workspaceId, uid);
    if (!isEditor || !isOwner) return { status: 401, video: null };

    const video = await Video.findById(videoId);

    if (video) {
        return {
            status: 200,
            video,
        };
    } else {
        return { status: 404, workspace: null };
    }
}

async function editVideo(title, description, videoBuffer, videoId, uid) {
    const isEditor = await getHasVideoOwnership(videoId, uid);
    if (!isEditor) return { status: 401, video: null };

    const updateObj = {
        updatedAt: getTimeStampString(),
        status: "pending",
    };

    if (videoBuffer) {
        const res = await uploadToCloudinary(videoBuffer);
        if (!res.secure_url || !res.public_id)
            return { status: 500, video: null };

        const video = await Video.findById(videoId);
        await deleteFromCloudinary(video.cloudinaryId);

        updateObj.url = res.secure_url;
        updateObj.cloudinaryId = res.public_id;
    }

    if (title) updateObj.title = title;
    if (description) updateObj.description = description;

    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId },
        updateObj,
        { new: true }
    );
    await updatedVideo.save();

    return {
        status: 200,
        video: updatedVideo,
    };
}

async function deleteVideo(videoId, uid) {
    const isOwner = await getHasVideoOwnership(videoId, uid);
    if (!isOwner) return { status: 401, video: null };

    const video = await Video.findById(videoId);
    await deleteFromCloudinary(video.cloudinaryId);

    await video.deleteOne();
    return 200;
}

module.exports = {
    getVideos,
    addNewVideo,
    getOneVideo,
    editVideo,
    deleteVideo,
};
