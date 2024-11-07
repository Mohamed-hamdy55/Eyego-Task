const express = require("express");
const router = express.Router();
const { upload } = require("../multer");
const { isAuthenticated } = require("../middleware/auth");
const userController = require("../controller/user")

// POST - Create a new pending user
router.post("/create-user", upload.single("file"), userController.createUser);

// POST - Activate pending user
router.post("/activation",userController.activateUser);

// POST - User Login
router.post("/login",userController.login);

// POST - forget password request
router.post("/forget-password", userController.handleForgetPassword);

// POST - create new password
router.post("/create-new-password",userController.createNewPassword);

// GET - Get User Object
router.get("/getuser",isAuthenticated,userController.getUser);

//GET - logged the user out
router.get("/logout",isAuthenticated,userController.logout);

module.exports = router;
