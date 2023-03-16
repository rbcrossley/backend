const express = require('express');
require('dotenv').config()


//middleware-first middleware  then routes
const bodyParser = require("body-parser")
const cors = require("cors")

//import database 
require("./database/connection")
const app = express()
const morgan = require("morgan")
const port = process.env.PORT
const TestRoute = require("./routes/testRoute")
const UserRoute = require("./routes/userRoute.js")
const CategoryRoute = require("./routes/categoryRoute")
const ProductRoute = require("./routes/productRoute")//file ko name sanga same hunu parxa.

const OrderRoute = require("./routes/orderRoute.js")

const PaymentRoute = require("./routes/paymentRoute")
app.use(bodyParser.json())
app.use(cors())
app.use("/api", CategoryRoute) //api/getAllCategories hunxa
app.use("/api", ProductRoute)
app.use("/api", UserRoute)
app.use(TestRoute)
app.use("/api", OrderRoute)
app.use(morgan("dev"))
app.use("/api", PaymentRoute)
app.use("/api/public/uploads", express.static("public/uploads"))

app.listen(port, () => {
  console.log(`server started successfully at port ${port}`)
})