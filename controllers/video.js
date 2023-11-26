const Video = require("../models/video");
const {
    uploadToCloudinary,
    deleteFromCloudinary,
} = require("../utils/cloudinary");
const { getTimeStampString } = require("../utils/helper");
const { getWorkspaceRoleById } = require("./workspace");

const limit = 5;

async function getVideoIfHasAccess(workspaceId, videoId, uid) {
    const video = await Video.findById(videoId);
    if (!video) return { status: 404, video: null };

    const workspaceRole = await getWorkspaceRoleById(workspaceId, uid);
    return workspaceRole === "creator"
        ? { status: 200, video }
        : workspaceRole === "editor" && video.uploadedBy === uid
          ? { status: 200, video }
          : { status: 401, video: null };
}

async function getVideos(workspaceId, uid, filter, page) {
    const workspaceRole = await getWorkspaceRoleById(workspaceId, uid);
    if (workspaceRole === "none") return { status: 401, video: null };

    const query = { workspaceId };
    if (["pending", "approved", "rejected"].includes(filter)) {
        query.status = filter;
    }
    if (workspaceRole === "editor") {
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
    const verify = (await getWorkspaceRoleById(workspaceId, uid)) === "editor";
    if (!verify) return { status: 401, video: null };

    const res = await uploadToCloudinary(videoBuffer);
    if (!res.secure_url || !res.public_id) return { status: 500, video: null };
    const timestamp = getTimeStampString();
    const newVideo = new Video({
        workspaceId,
        title,
        description,
        url: res.secure_url,
        publicId: res.public_id,
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
    const { status, video } = await getVideoIfHasAccess(
        workspaceId,
        videoId,
        uid
    );

    if (video) {
        return {
            status: status,
            video,
        };
    } else {
        return { status, video };
    }
}

async function editVideo(
    title,
    description,
    videoBuffer,
    workspaceId,
    videoId,
    uid
) {
    const { status, video } = await getVideoIfHasAccess(
        workspaceId,
        videoId,
        uid
    );
    if (video) {
        const updateObj = {
            updatedAt: getTimeStampString(),
            status: "pending",
        };

        if (videoBuffer) {
            const res = await uploadToCloudinary(videoBuffer);
            if (!res.secure_url || !res.public_id)
                return { status: 500, video: null };

            await deleteFromCloudinary(video.publicId);

            updateObj.url = res.secure_url;
            updateObj.publicId = res.public_id;
        }

        if (title) updateObj.title = title;
        if (description) updateObj.description = description;

        const updatedVideo = await Video.findOneAndUpdate(
            { _id: videoId },
            updateObj,
            { new: true }
        );

        return {
            status: 200,
            video: updatedVideo,
        };
    } else {
        return { status, video };
    }
}

async function deleteVideo(videoId, uid) {
    const video = await Video.findById(videoId);
    if (!video) return { status: 404, video: null };
    if (video.uploadedBy !== uid) return { status: 401, video: null };

    await deleteFromCloudinary(video.publicId);
    await video.deleteOne();
    return 200;
}

module.exports = {
    getVideos,
    addNewVideo,
    getOneVideo,
    editVideo,
    deleteVideo,
    getVideoIfHasAccess,
};
