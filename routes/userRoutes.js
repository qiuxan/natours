const express = require('express');
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require("../controllers/userController");
// require authController.js
const { signup, login, forgotPassword } = require("../controllers/authController");

const router = express.Router();

// signup route
router.post('/signup', signup);
router.post('/login', login);

router.post('/forgetPassword', forgotPassword);
router.patch('/resetPassword/:token', login);


router.route('/')
    .get(getAllUsers)
    .post(createUser);


router.route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser);

module.exports = router;