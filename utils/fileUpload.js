const multer = require("multer")
//fs=file system
const fs = require("fs")
//path
const path = require("path")



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destination = "public/uploads"
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true })
    }
    cb(null, destination)
  },
  filename: function (req, file, cb) {
    //extension of file ko lagi
    let extname = path.extname(file.originalname)
    let filename = path.basename(file.originalname, extname)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let finalname = filename + uniqueSuffix + extname;
    cb(null, finalname)
  }
})
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|JPG|png|jpeg|JPEG|gif|GIF|svg|SVG|jfif|JFIF)/)) {
    return cb(new Error("Image format not supported"), false)
  }
  //error  ayena bhane
  cb(null, true)
}
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2000000
  }

})

module.exports = upload

// filename unique banaune code liraxa filename le destination le kaahan lagera save garne code liraxa