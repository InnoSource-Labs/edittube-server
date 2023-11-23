const { auth } = require("express-oauth2-jwt-bearer");
const enviroment = require("../enviroment");

const jwtCheck = auth({
    audience: enviroment.api_identifier,
    issuerBaseURL: enviroment.auth_domin,
    tokenSigningAlg: "RS256",
});

const unauthorized = (err, req, res, next) => {
    if (err) {
        res.status(401).send("Unauthorized");
    } else {
        next();
    }
};

module.exports = { jwtCheck, unauthorized };
