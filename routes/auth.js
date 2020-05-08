const router = require("express").Router();
const { logIn } = require("../controllers/auth");
const { handleNewSessionRequests } = require("../utils/authutils");

router.post("/login", handleNewSessionRequests, logIn);

module.exports = router;