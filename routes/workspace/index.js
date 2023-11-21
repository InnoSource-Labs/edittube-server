const { Router } = require("express");
const {
    getAllWorkspaces,
    getCreatorWorkspaces,
    getEditorWorkspaces,
} = require("../../controllers/workspace");

const router = Router();

router.get("/all", async (req, res) => {
    try {
        const { uid, page } = req.query;
        if (uid) {
            const data = await getAllWorkspaces(uid, page ? page : 1);
            res.status(200).json({
                success: true,
                message: "Successfully fetched data!",
                data,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Please provide uid",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/creator", async (req, res) => {
    try {
        const { uid, page } = req.query;
        if (uid) {
            const data = await getCreatorWorkspaces(uid, page ? page : 1);
            res.status(200).json({
                success: true,
                message: "Successfully fetched data!",
                data,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Please provide uid",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/editor", async (req, res) => {
    try {
        const { uid, page } = req.query;
        if (uid) {
            const data = await getEditorWorkspaces(uid, page ? page : 1);
            res.status(200).json({
                success: true,
                message: "Successfully fetched data!",
                data,
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Please provide uid",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;
