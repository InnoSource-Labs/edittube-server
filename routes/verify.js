const { Router } = require("express");
const { getNewToken } = require("../utils/OAuth2");

const router = Router({ mergeParams: true });

router.get("/", async (req, res) => {
    try {
        const { state, code } = req.params;
        if (state && code) {
            const status = getNewToken(state, code);
            res.status(status).send();
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
