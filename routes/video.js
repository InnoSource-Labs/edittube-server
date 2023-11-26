const multer = require("multer");
const { Router } = require("express");
const {
    getVideos,
    getOneVideo,
    addNewVideo,
    editVideo,
    deleteVideo,
} = require("../controllers/video");
const { getLoggedinUID } = require("../utils/helper");

const router = Router({ mergeParams: true });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { workspaceId } = req.params;
        const { filter, page } = req.query;

        if (uid) {
            const data = await getVideos(
                workspaceId,
                uid,
                filter || "all",
                Number(page) || 1
            );
            res.status(200).json(data);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/", upload.single("video"), async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { workspaceId } = req.params;
        const { title, description } = req.body;
        const videoBuffer = req.file.buffer;

        if (title && description && videoBuffer) {
            const { status, video } = await addNewVideo(
                title,
                description,
                videoBuffer,
                workspaceId,
                uid
            );
            res.status(status).json(video);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/:videoId", async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { workspaceId, videoId } = req.params;

        if (videoId) {
            const { status, video } = await getOneVideo(
                workspaceId,
                videoId,
                uid
            );
            res.status(status).json(video);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.put("/:videoId", upload.single("video"), async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { videoId } = req.params;
        const { title, description } = req.body;
        const videoBuffer = req.file?.buffer;

        if (videoId) {
            const { status, video } = await editVideo(
                title,
                description,
                videoBuffer,
                videoId,
                uid
            );
            res.status(status).json(video);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.delete("/:videoId", async (req, res) => {
    try {
        const { videoId } = req.params;
        const uid = getLoggedinUID(req.auth);

        if (videoId) {
            const status = await deleteVideo(videoId, uid);
            res.status(status).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
