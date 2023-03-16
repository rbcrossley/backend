//import models

const Product = require("../models/productModel.js")

//to add new product

exports.addProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "product image is required" })
  }
  let productToAdd = new Product({
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_description: req.body.product_description,
    product_image: req.file.path,
    count_in_stock: req.body.count_in_stock,
    category: req.body.category
  })

  productToAdd = await productToAdd.save()
  if (!productToAdd) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(productToAdd)
}

//to view all products
exports.getAllProducts = async (req, res) => {
  let products = await Product.find().populate("category", "category_name")
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(products)
}

//to get filtered products

exports.getFilteredProducts = async (req, res) => {
  let Args = {}
  for (var key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "category") {
        Args[key] = req.body.filters[key]
      }
      else {
        Args[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1]
        }
      }
    }
  }
  let products = await Product.find(Args).populate("category", "category_name")
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(products)
}
//to get products of same categories

exports.getProductsByCategory = async (req, res) => {
  let products = await Product.find({ category: req.params.categoryid })
  if (!products) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(products)

}

//to getproduct details

exports.getProductDetails = async (req, res) => {
  let product = await Product.findById(req.params.id).populate("category", "category_name")
  if (!product) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(product)
}

//to update product

exports.updateProduct = async (req, res) => {

  let productToUpdate = await Product.findByIdAndUpdate(req.params.id, req.file ? {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_description: req.body.product_description,
    category: req.body.category,
    count_in_stock: req.body.count_in_stock,
    rating: req.body.rating,
    product_image: req.file.path
  } : {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_description: req.body.product_description,
    category: req.body.category,
    count_in_stock: req.body.count_in_stock,
    rating: req.body.rating,
  }, { new: true })
  //findbyid and update so save garnu parena

  if (!productToUpdate) {
    return res.status(400).json({ error: "something went wrong" })
  }
  res.send(productToUpdate)
}

//delete product
exports.deleteProduct = (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then(productToDelete => {
      if (!productToDelete) {
        return res.status(400).json({ error: "product not found" })
      }
      res.send({ message: "Product deleted successfully" })
    })
    .catch(err => res.status(400).json({ error: err.message }))
}

//to get related  products
exports.getRelatedProducts = async (req, res) => {
  let product = await Product.findById(req.params.id)
  let relatedProducts = await Product.find({
    category: product.category,
    _id: { $ne: product._id }
  })
  if (!relatedProducts) {
    return res.status(400).json({ error: "Something went wrong" })
  }
  res.send(relatedProducts)
}