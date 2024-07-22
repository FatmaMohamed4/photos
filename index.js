// const express = require('express')
// const { addItem } = require('./controller.js')
const DB =require('./Db conn.js')
// const app = express()
// const port = 3000
DB()

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => res.send('Hello World!'))
// app.post('/add', addItem)
// app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const Item = require('./model.js');

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({ 
  cloud_name: 'djzbdq0km', 
  api_key: '348278345164438', 
  api_secret: 'c3z1MUSnR084R4Rv9abL40TQoAc',
});

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const uploadPhoto = async (req, res, next) => {
  upload.single('photo')(req, res, async function (err) {
    try {
      if (err) {
        console.error(err);
        return next(new Error('Error uploading file'));
      }

      if (!req.file) {
        return next(new Error('No file uploaded'));
      }

      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.photo = result.secure_url;
      next();
    } catch (err) {
      res.status(500).send('Error processing request');
    }
  });
};

app.post('/addItem', uploadPhoto, async (req, res) => {
  try {
    const { name, photo } = req.body;

    await Item.create({
      name: name,
      photo: photo,
    });
    res.send("created");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
