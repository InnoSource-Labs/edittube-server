const { Router } = require("express");
const { updateLogedinUser } = require("../../controllers/user");

const router = Router();

router.post("/logedin", async (req, res) => {
    try {
        const { uid, email } = req.body;
        if (uid && email) {
            const { status, user } = await updateLogedinUser(req.body);
            res.status(status).json(user);
        } else {
            res.status(400).json({ message: "Bad Request" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
