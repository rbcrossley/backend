const User = require("../models/userModel")
const Token = require("../models/tokenModel.js")
let crypto = require("crypto")
const sendEmail = require("../utils/setEmail.js")
//to register new user
const jwt = require("jsonwebtoken")
const { expressjwt } = require("express-jwt")

exports.userRegister = async (req, res) => {
  //destructuring to get username,email,password
  const { username, email, password } = req.body
  let user = await User.findOne({ email: email })
  if (user) {
    return res.status(400).json({ error: "Email already registered" })
  }
  //user xaina vane
  let userToRegister = new User({
    username: username,
    email: email,
    password: password
  })
  userToRegister = await userToRegister.save()
  if (!userToRegister) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  //generate token
  let token = new Token({
    token: crypto.randomBytes(24).toString("hex"),
    user: userToRegister._id
  })
  token = await token.save()

  if (!token) {
    return res.status(400).json({ error: "Something went wrong" })
  }

  //sent verification email
  const url = `${process.env.FRONTEND_URL}/emailVerification/${token.token}`

  sendEmail({
    from: "noreply@example.com",
    to: email,
    subject: "verification email",
    text: `Click on the following link or copy paste it in browser to verify your email`,
    html: `<a href="${url}"><button>Verify Email</button></a>`
  })

  res.send(userToRegister)
}

//to verify email/user

exports.emailVerification = async (req, res) => {
  //check token 
  let token = await Token.findOne({ token: req.params.token })
  if (!token) {
    return res.status(400).json({ error: "Invalid token or token may have expired." })
  }
  //check user
  let user = await User.findById(token.user)
  if (!user) {
    return res.status(400).json({ error: "User associated with the token not found" })
  }

  //check if already verified
  if (user.isVerified) {
    return res.status(400).json({ error: "User already verified, Login to continue" })
  }

  //verify user
  user.isVerified = true
  user = await user.save()
  if (!user) {
    return res.status(400).json({ error: "SOmething went wrong" })
  }
  res.status(200).json({ message: "User verified successfully" })


}

//resend verification


exports.resendVerification = async (req, res) => {
  //check email

  let user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).json({ error: "Email not registered" })
  }
  //check if already verified
  if (user.isVerified) {
    return res.status(400).json({ error: "User already verified, Login to continue" })
  }

  //generate token
  //generate token
  let token = new Token({
    token: crypto.randomBytes(24).toString("hex"),
    user: user._id
  })
  token = await token.save()

  if (!token) {
    return res.status(400).json({ error: "Something went wrong" })
  }

  //send token in email

  //sent verification email
  // const url = `http://localhost:5000/api/emailverification/${token.token}`

  const url = `${process.env.FRONTEND_URL}/emailVerification/${token.token}`

  sendEmail({
    from: "noreply@example.com",
    to: user.email,
    subject: "verification email",
    text: `Click on the following link or copy paste it in browser to verify your email`,
    html: `<a href="${url}"><button>Verify Email</button></a>`
  })
  res.send({ message: "Email verification link has been sent to your email." })
}

//forget password

exports.forgetpassword = async (req, res) => {
  //check email
  let user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).json({ error: "User not registered" })
  }

  //generate token
  let token = new Token({
    token: crypto.randomBytes(24).toString("hex"),
    user: user._id
  })

  token = await token.save()

  if (!token) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  //send reset link with token in email
  const url = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`

  // const url = `${process.env.FRONTEND_URL}/emailVerification/${token.token}`

  sendEmail({
    from: "noreply@example.com",
    to: user.email,
    subject: "Reset Password",
    text: `Click on the following link or copy paste it in browser to reset your password. ${url}`,
    html: `<a href="${url}"><button>Reset Password</button></a>`

  })

  res.send({ message: "Password reset link has been sent to your email" })
}

//reset password

exports.resetPassword = async (req, res) => {
  //check token

  let token = await Token.findOne({ token: req.params.token })
  if (!token) {
    return res.status(400).json({ error: "Invalid token or token may have expired" })
  }
  //find user
  let user = await User.findById(token.user)

  if (!user) {
    return res.status(400).json({ error: "User associated with the token not found" })
  }
  //reset password
  user.password = req.body.password
  user = await user.save()
  if (!user) {
    return res.status(400).json({ error: "something went wrong" })
  }
  res.send({ message: "Password reset successful" })
}

//jwt-authentication

//sign in process

exports.signIn = async (req, res) => {
  let { email, password } = req.body
  //check email
  let user = await User.findOne({ email: email })


  if (!user) {
    return res.status(400).json({ error: "Email not registered" })
  }
  //check password
  if (!user.authenticate(password)) {
    return res.status(400).json({ error: "Email and password don't  match" })
  }
  //check if user is verified
  if (!user.isVerified) {
    return res.status(400).json({ error: "user not verified" })
  }
  //generate token jwt
  let token = jwt.sign({ user: user._id, role: user.role }, process.env.JWT_SECRET)
  res.cookie("mycookie", token, { expire: Date.now() + 86400 })
  //send information to frontend
  let { _id, username, role } = user
  res.send({ token, user: { _id, username, role, email } })
}


//env bata variables import garna lai Process.env

exports.signOut = async (req, res) => {
  let response = await res.clearCookie("myCookie")
  if (!response) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send({ message: "Signed out successfully" })
}

//authorization
exports.requireSignin = expressjwt({

  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"]
})