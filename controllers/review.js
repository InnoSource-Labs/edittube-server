const Video = require("../models/video");
const Workspace = require("../models/workspace");
const { getVideoIfHasAccess } = require("./video");
const { deleteFromCloudinary } = require("../utils/cloudinary");
const { getTimeStampString } = require("../utils/helper");
const uploadVideoOnYouTube = require("../utils/youtube");

async function approveVideo(workspaceId, videoId, uid) {
    const { status, video } = await getVideoIfHasAccess(
        workspaceId,
        videoId,
        uid
    );

    const workspace = await Workspace.findById(workspaceId);

    if (video) {
        // const updateObj = {
        //     updatedAt: getTimeStampString(),
        //     status: "approved",
        // };

        uploadVideoOnYouTube(workspaceId, workspace.youtubeSecret, video);
        // excute function to upload on youtube
        // get youtube url and publicId
        // put above on updateObj

        // const updatedVideo = await Video.findOneAndUpdate(
        //     { _id: videoId },
        //     updateObj,
        //     { new: true }
        // );

        return {
            status: 200,
            video,
        };
    } else {
        return { status, video };
    }
}

async function regectVideo(workspaceId, videoId, uid, keepVideo) {
    const { status, video } = await getVideoIfHasAccess(
        workspaceId,
        videoId,
        uid
    );

    if (video) {
        const updateObj = {
            updatedAt: getTimeStampString(),
            status: "rejected",
        };

        if (!keepVideo) {
            await deleteFromCloudinary(video.publicId);
            updateObj.url = "deleted";
            updateObj.publicId = "deleted";
        }

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

module.exports = { approveVideo, regectVideo };
