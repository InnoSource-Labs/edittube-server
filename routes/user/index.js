const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    res.send("Hi from /users router.");
});

module.exports = router;
