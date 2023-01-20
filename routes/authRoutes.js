const express = require('express');
const authRouter = express.Router();
const {signupController, signInController, forgetPasswordController, resetPasswordController, generateOtp}  = require("../controller/authController");

authRouter.patch("/forgetPassword", forgetPasswordController)

authRouter.patch("/resetPassword", resetPasswordController)

authRouter.post("/signup", signupController)

authRouter.post('/signin', signInController)

module.exports = authRouter;