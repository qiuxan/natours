const express = require('express');
const { deleteMe, getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, getMe } = require("../controllers/userController");
// require authController.js
const { signup, login, forgotPassword, resetPassword, protect, updatePassword, restrictTo } = require("../controllers/authController");

const router = express.Router();

// signup route
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// protect all routes after this middleware
router.use(protect);

router.patch('/updatePassword', updatePassword);

router.delete('/deleteMe', deleteMe);
// updateMe route
router.patch('/updateMe', updateMe);
router.get('/me',

    getMe,
    getUser
);

// protect all routes after this middleware (only admin can access)
router.use(restrictTo('admin'));
router.route('/')
    .get(getAllUsers)
    .post(createUser);


router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;