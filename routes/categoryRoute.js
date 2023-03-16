//import first
const express = require("express");
const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require("../controller/categoryController");
const { signIn, requireSignin } = require("../controller/userController.js");
const { categoryCheck, validate } = require("../validation/validator.js");
const router = express.Router()
router.post("/addcategory", categoryCheck, requireSignin, validate, addCategory)
router.get("/getallcategories", getAllCategories)
router.get("/categorydetails/:id", getCategoryDetails)

router.put("/updatecategory/:id", requireSignin, updateCategory)
router.delete("/deletecategory/:id", requireSignin, deleteCategory)

module.exports = router
