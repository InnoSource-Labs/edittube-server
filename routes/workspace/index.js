const { Router } = require("express");
const {
    getWorkspaces,
    addNewWorkspace,
    editWorkspace,
    deleteWorkspace,
    getOneWorkspace,
} = require("../../controllers/workspace");

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { uid, filter, page } = req.query;

        if (uid) {
            const data = await getWorkspaces(
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

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { uid } = req.query;

        if (id && uid) {
            const data = await getOneWorkspace(id, uid);
            res.status(200).json(data);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.post("/new", async (req, res) => {
    try {
        const { creatorId, clientId, clientSecret } = req.body;

        if (creatorId && clientId && clientSecret) {
            const { status, workspace } = await addNewWorkspace(req.body);
            res.status(status).json(workspace);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.put("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { clientId, clientSecret } = req.body;

        if (id && clientId && clientSecret) {
            const { status, workspace } = await editWorkspace(req.body, id);
            res.status(status).json(workspace);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            await deleteWorkspace(id);
            res.status(200).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
