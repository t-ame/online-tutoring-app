const router = require("express").Router();
const subjectController = require("../controllers/subject");
const { authenticateUser, handleNewSessionRequests, handleAdminRequests, handleTutorRequests, currentUserOnly } = require("../utils/authutils");

router.post('/', handleNewSessionRequests, userController.signUp);

router.put('/:username', authenticateUser, currentUserOnly, handleAdminRequests, userController.updateUserByUsername);



module.exports = router;