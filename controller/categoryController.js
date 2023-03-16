//import categorymodel

const Category = require("../models/categoryModel")

//add category

exports.addCategory = async (req, res) => {
  //check if category already exists
  let category = await Category.findOne({ category_name: req.body.category_name })
  if (category) {
    return res.status(400).json({ error: "category already exists" })
  }
  //if category do not exit, add new category
  let categoryToAdd = new Category({ category_name: req.body.category_name })
  categoryToAdd = await categoryToAdd.save()
  if (!categoryToAdd) {
    return res.status(400).json({ error: "Something went wrong" }) //object error because JSON format  ma data passed.
  }
  res.send(categoryToAdd)
}


//to get all categories:
exports.getAllCategories = async (req, res) => {
  let categories = await Category.find()
  if (!categories) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(categories)
}

//category details

exports.getCategoryDetails = async (req, res) => {
  let category = await Category.findById(req.params.id)
  if (!category) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(category)
}

exports.updateCategory = async (req, res) => {
  let categoryToUpdate = await Category.findByIdAndUpdate(req.params.id, { category_name: req.body.category_name }, { new: true })

  if (!categoryToUpdate) {
    return res.status(400).json({ error: "something went wrong" })
  }
  res.send(categoryToUpdate)
}

exports.deleteCategory = (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then(categoryToDelete => {
      if (!categoryToDelete) {
        return res.status(400).json({ error: "Category not found" })
      }
      res.send({ message: "Category deleted successfully" })
    })
    .catch(err => res.status(400).json({ error: err.message }))
}
/*req.body ->to get values from forms
req.params->to get values from URL.
req.query->to get values from URL using variables
*/

/*
res.status(400).json({key:value})
400-bad request
200-OK
res.send(obj)
*/

/*
Model.find()=>returns all data/document

Model.find(filter)->returns all document in array that matches the filter

Model.findOne(filter)=>returns first document that matches the filter in object.

Model.findById(id)->returns document that has the id.

Model.findByIdAndUpdate()
Model.findByIdAndDelete()
*/