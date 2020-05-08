const jwt = require("jsonwebtoken");
const { isUserAdmin, isUserTutor, isUserStudent } = require("./apputils");

const newSessionRoutes = [{ path: '/login', method: 'POST' }, { path: '/signup', method: 'POST' }];
const authRoutes = [{ path: '/user/category', method: 'POST' }];

const SECRET_KEY = "JWT_SECRET";

exports.jwtParams = {
    getSecretKey: () => SECRET_KEY,
};

exports.handleNewSessionRequests = async (req, res, next) => {
    console.log("Handling New Session Requests");

    req.newSessionRequired = true;
    next();
}

exports.authenticateUser = async (req, res, next) => {
    console.log("Authenticating User");

    req.session = {};

    let authHeader = req.header('Authorization');
    let sessionID = authHeader ? authHeader.split(' ')[1] : undefined;

    if (!sessionID)
        return res.status(401).send({ status: false, message: "Missing access token" });

    let userData = this.verifyToken(sessionID);
    if (userData) {
        req.session.userData = userData;
        req.session.sessionID = sessionID;
    } else {
        return res.status(401).send({ status: false, message: "Invalid access token" });
    }


    next();
}

exports.handleAdminRequests = async (req, res, next) => {
    console.log("Handling Admin Requests");

    let userData = req.session.userData;
    if (userData) {
        if (!(res.currentUserId || this.isUserAuthorized(true, false, userData))) {
            return res.status(401).send({ status: false, message: "Unauthorized Access" });
        }
    } else {
        return res.status(401).send({ status: false, message: "Invalid access token" });
    }

    next();
}

exports.handleTutorRequests = async (req, res, next) => {
    console.log("Handling Tutor Requests");

    let userData = req.session.userData;
    if (userData) {
        if (!(res.currentUserId || this.isUserAuthorized(false, true, userData))) {
            return res.status(401).send({ status: false, message: "Unauthorized Access" });
        }
    } else {
        return res.status(401).send({ status: false, message: "Invalid access token" });
    }

    next();
}

exports.handleAllResponses = (req, res, next) => {
    console.log("Handling Responses");

    if (!res.data) {
        return res.status(404).send({
            status: false,
            message: "Invalid Endpoint"
        });
    }
    if (req.newSessionRequired && req.session.userData) {
        try {
            let token = this.generateJWTToken(req.session.userData);
            res.setHeader('session-token', token);
            res.data['session-token'] = token;
        } catch (e) {
            console.log('Error:', e);
        }
    }
    if (req.session && req.session.sessionID) {
        try {
            res.setHeader('session-token', req.session.sessionID);
            res.data['session-token'] = req.session.sessionID;
        } catch (e) {
            console.log('Error:', e);
        }
    }
    res.status(res.statusCode || 200)
        .send({ status: true, response: res.data });
}

exports.currentUserOnly = (req, res, next) => {
    let userData = req.session.userData;
    if (userData) {
        res.currentUserId = userData._id;
        res.currentUserEmail = userData.email;
    } else {
        return res.status(401).send({ status: false, message: "Invalid access token" });
    }

    next();
}

exports.isUserAuthorized = (adminRequired, tutorRequired, userData) => {
    if (adminRequired)
        return isUserAdmin(userData);
    if (tutorRequired)
        return isUserTutor(userData);
    return true;
}

exports.isNewSessionRequired = (httpMethod, url) => {
    for (let routeObj of newSessionRoutes) {
        if (routeObj.method === httpMethod && routeObj.path === url) {
            return true;
        }
    }
    return false;
}

exports.isAuthRequired = (httpMethod, url) => {
    for (let routeObj of authRoutes) {
        if (routeObj.method === httpMethod && routeObj.path === url) {
            return true;
        }
    }
    return false;
}

exports.generateJWTToken = (userData) => {
    return jwt.sign(userData, this.jwtParams.getSecretKey(), { expiresIn: "1h" });
}

exports.verifyToken = (jwtToken) => {
    try {
        return jwt.verify(jwtToken, this.jwtParams.getSecretKey(), { expiresIn: "1h" });
    } catch (e) {
        console.log('Error:', e);
        return null;
    }
}

