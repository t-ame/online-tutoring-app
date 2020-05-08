const router = require("express").Router();
const userController = require("../controllers/user");
const { handleNewSessionRequests, handleAdminRequests, handleTutorRequests, currentUserOnly } = require("../utils/authutils");

router.post('/', handleNewSessionRequests, userController.signUp);

router.put('/:username', currentUserOnly, handleAdminRequests, userController.updateUserByUsername);

router.get('/', handleAdminRequests, userController.getAll);

router.get('/:username', currentUserOnly, handleAdminRequests, userController.getUserByUsername);

router.get('/:username/subjects', currentUserOnly, handleAdminRequests, userController.getUserSubjects);

router.get('/:username/categories', currentUserOnly, handleAdminRequests, userController.getUserCategories);


// userController.makeTutorAdmin("toya@gmail.com");

module.exports = router;