const router = require("express").Router();
const categoryController = require("../controllers/category");
const { authenticateUser, handleNewSessionRequests, handleAdminRequests, handleTutorRequests, currentUserOnly } = require("../utils/authutils");

router.post('/', authenticateUser, handleAdminRequests, categoryController.addCategory);

router.get('/', authenticateUser, categoryController.getAll);

router.get('/:catname', authenticateUser, categoryController.getCategoryByName);

router.get('/:catname/subjects', authenticateUser, categoryController.getSubjectsByCatName);

router.delete('/:catname', authenticateUser, handleAdminRequests, categoryController.deleteCategoryByName);


module.exports = router;