const jwt = require("jsonwebtoken");
const { jwtParams } = require("../utils/authutils");

module.exports = function (req, res, next) {
    let authHeader = req.headers["x-access-token"] || req.headers["Authorization"];
    let sessionID = authHeader ? authHeader.split(' ')[1] : null;

    if (!sessionID) return res.status(401).send("Access denied. No token provided.");

    try {
        const userData = jwt.verify(sessionID, jwtParams.getSecretKey());
        req.user = userData;
        next();
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
};

