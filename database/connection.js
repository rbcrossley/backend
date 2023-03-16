//TO CONNECT DATABASE

//import mongoose step 1
const mongoose = require('mongoose');

//step 2
mongoose.connect(process.env.DATABASE)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch(error => console.log(error))