const Item = require('./model.js');
const { uploadPhoto } = require('./photos.js');

exports.addItem = async (req, res) => {
  try {
    const name = req.body.name;
    const photo = req.body.photo;
    const upload = await uploadPhoto(photo);

    await Item.create({
      name: name,
      photo: upload,
    });
    res.send("created");
  } catch (err) {
    res.send("Error: " + err.message);
  }
};