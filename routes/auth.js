const router = require("express").Router();
const { signUp, logIn } = require("../controllers/auth");


router.get("/", (req, res) => {
    res.send("This is the express app. You have now entered express");
});

router.post('/signup', signUp);
router.post("/login", logIn);


module.exports = router;