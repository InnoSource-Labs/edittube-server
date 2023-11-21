const { Router } = require("express");
const { getWorkspaces } = require("../../controllers/workspace");

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
            res.status(400);
        }
    } catch (error) {
        res.status(500);
    }
});

module.exports = router;
