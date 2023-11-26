const { Router } = require("express");
const { approveVideo, regectVideo } = require("../controllers/review");
const { getLoggedinUID } = require("../utils/helper");

const router = Router({ mergeParams: true });

router.post("/approve", async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { workspaceId, videoId } = req.params;

        if (workspaceId && videoId) {
            const { status, video } = await approveVideo(
                workspaceId,
                videoId,
                uid
            );
            res.status(status).json(video);
        } else {
            res.status(400).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});

router.post("/reject", async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { workspaceId, videoId } = req.params;
        const { keepVideo } = req.body;

        if (workspaceId && videoId) {
            const { status, video } = await regectVideo(
                workspaceId,
                videoId,
                uid,
                keepVideo
            );
            res.status(status).json(video);
        } else {
            res.status(400).send();
        }
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
