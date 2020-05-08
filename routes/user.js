const router = require("express").Router();
const userController = require("../controllers/user");
const { authenticateUser, handleNewSessionRequests, handleAdminRequests, handleTutorRequests, currentUserOnly } = require("../utils/authutils");

router.post('/', handleNewSessionRequests, userController.signUp);

router.put('/:username', authenticateUser, currentUserOnly, handleAdminRequests, userController.updateUserByUsername);

router.get('/', authenticateUser, handleAdminRequests, userController.getAll);

router.get('/:username', authenticateUser, currentUserOnly, handleAdminRequests, userController.getUserByUsername);

router.get('/:username/subjects', authenticateUser, currentUserOnly, handleAdminRequests, userController.getUserSubjects);

router.get('/:username/categories', authenticateUser, currentUserOnly, handleAdminRequests, userController.getUserCategories);


// userController.makeTutorAdmin("toya@gmail.com");

module.exports = router;