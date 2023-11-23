const { Router } = require("express");
const {
    getWorkspaces,
    addNewWorkspace,
    editWorkspace,
    deleteWorkspace,
    getOneWorkspace,
} = require("../controllers/workspace");
const { getLoggedinUID } = require("../utils/healper");

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
        const { clientId, clientSecret, name } = req.body;
        const creatorId = getLoggedinUID(req.auth);

        if (clientId && clientSecret && name) {
            const { status, workspace } = await addNewWorkspace(
                req.body,
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
        const { clientId, clientSecret, name } = req.body;
        const uid = getLoggedinUID(req.auth);

        if (id && clientId && clientSecret && name) {
            const { status, workspace } = await editWorkspace(
                req.body,
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

module.exports = router;
