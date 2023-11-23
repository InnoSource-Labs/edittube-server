const { Router } = require("express");
const { updateLoggedinUser } = require("../controllers/user");

const router = Router({ mergeParams: true });

router.post("/loggedin", async (req, res) => {
    try {
        const { sub, email } = req.body;
        if (sub && email) {
            const { status, user } = await updateLoggedinUser(req.body);
            res.status(status).json(user);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;
