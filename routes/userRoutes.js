const express = require('express');
const { deleteMe, getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe } = require("../controllers/userController");
// require authController.js
const { signup, login, forgotPassword, resetPassword, protect, updatePassword } = require("../controllers/authController");

const router = express.Router();

// signup route
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);
router.delete('/deleteMe', protect, deleteMe);

// updateMe route
router.patch('/updateMe', protect, updateMe);

router.route('/')
    .get(getAllUsers)
    .post(createUser);


router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;