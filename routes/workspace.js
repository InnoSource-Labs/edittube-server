const { Router } = require("express");
const {
    getWorkspaces,
    addNewWorkspace,
    editWorkspace,
    deleteWorkspace,
    getOneWorkspace,
} = require("../controllers/workspace");
const { getLoggedinUID } = require("../utils/helper");
const { getNewToken } = require("../utils/OAuth2");
const enviroment = require("../enviroment");

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
    try {
        const { filter, page } = req.query;
        const uid = getLoggedinUID(req.auth);
        const data = await getWorkspaces(
            uid,
            filter || "all",
            Number(page) || 1
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, editors } = req.body;
        const youtubeSecret = enviroment.youtube_secret;
        const creatorId = getLoggedinUID(req.auth);

        if (youtubeSecret && name) {
            const { status, workspace } = await addNewWorkspace(
                { name, youtubeSecret, editors },
                creatorId
            );
            res.status(status).json(workspace);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/:id", async (req, res) => {
    try {
        const uid = getLoggedinUID(req.auth);
        const { id } = req.params;

        if (id && uid) {
            const { status, workspace } = await getOneWorkspace(id, uid);
            res.status(status).json(workspace);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, editors } = req.body;
        const youtubeSecret = enviroment.youtube_secret;
        const uid = getLoggedinUID(req.auth);

        if (id && youtubeSecret && name) {
            const { status, workspace } = await editWorkspace(
                { name, youtubeSecret, editors },
                id,
                uid
            );
            res.status(status).json(workspace);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const uid = getLoggedinUID(req.auth);

        if (id) {
            const status = await deleteWorkspace(id, uid);
            res.status(status).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.get("/:id/verify", async (req, res) => {
    try {
        const { id } = req.params;
        const { code } = req.query;

        if (id && code) {
            const status = await getNewToken(id, code);
            res.status(status).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        if (
            error.response.data.error === "invalid_grant" &&
            error.response.data.error_description === "Bad Request"
        ) {
            res.status(200).send();
        }
        res.status(500).send();
    }
});

module.exports = router;
