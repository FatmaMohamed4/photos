
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

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

exports.uploadPhoto = async (req, res, next) => {
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