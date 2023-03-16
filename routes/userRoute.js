const express = require("express")
const { userRegister, emailVerification, resendVerification, forgetpassword, resetPassword, signIn, signOut } = require("../controller/userController.js")
const { userCheck, validate } = require("../validation/validator.js")
const router = express.Router()
router.post("/register", userCheck, validate, userRegister)
router.post("/resendverification", resendVerification)
router.get("/emailverification/:token", emailVerification)
router.post("/forgetpassword", forgetpassword)
router.post("/resetpassword/:token", resetPassword)
router.post("/signin", signIn)
router.get("/signout", signOut)
module.exports = router

//url bata value lina lai :token