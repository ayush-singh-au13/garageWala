const express = require("express");
const router = express.Router();
const ctrl = require('./../controllers/banner.controller');
const upload = require('./../utils/multer');
const bannerModel = require('./../models/banner.model');
const cloudinary = require('./../utils/cloudinary');

router.post("/addBanner", upload.single("bannerImage"), async (req, res) => {
    try {
      // Upload image to cloudinary
      let maxsize = 5 * 1000 * 1024;
      if(req.file.size > maxsize) {
        return res.send("Max allowed size is 1MB");
      }
      
      const result = await cloudinary.uploader.upload(req.file.path);
      // Create new user
      let user = await bannerModel.create({
        bannerName: req.body.bannerName,
        bannerImage: result.secure_url,
        cloudinary_id: result.public_id,
      });

      res.status(200)
        .send({
          user
        });
    } catch (err) {
      console.log(err);
    }
  });

router.get('/bannerList', ctrl.bannerList);

router.delete('/deleteBanner', ctrl.deleteBanner)
module.exports = router;