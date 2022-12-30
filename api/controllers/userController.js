const Joi = require("joi");
// const fs = require("fs");
// const sharp = require("sharp");
const mongoose = require("mongoose");
const user = mongoose.model("user");
const bcrypt = require("bcrypt");
const { truncateSync } = require("fs");
const userRoutes = require("../routes/userRoutes");
//function/controller

// exports.sign_in = async (req, res) => {
//   let accessToken = req.params.token;
//   const schema = {
//     name: Joi.string().min(3).required(),
//   };
//   let userInfoResponse = await fetch(
//     "https://www.googleapis.com/userinfo/v2/me",
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   let _userInfo = await userInfoResponse.json();
//   // TODO use token and check in server
//   _userInfo = {
//     name: _userInfo.name,
//     email: _userInfo.email,
//     picture: _userInfo.picture,
//     googleId: _userInfo.id,
//     provider: "google",
//   };
//   user.findOne({ googleId: _userInfo.googleId }, (err, user) => {
//     if (err) {
//       res.send(err);
//     } else if (null) {
//       newUser = new user(_userInfo);
//       newUser.save((err, user) => {
//         if (err) res.send(err);
//         res.json(user);
//       });
//     } else {
//       res.json(user);
//     }
//   });
// };

exports.sign_in = async (req, res) => {
  const current_user = await user.findOne({ email: req.body.email });
  if (current_user == null) {
    res.send("no user found");
  } else {
    try {
      if (await bcrypt.compare(req.body.password, current_user.password)) {
        res.json(current_user);
      } else {
        res.send("password incorrect");
      }
    } catch (e) {
      console.log(e, "catch error");
      res.status(500).send(e);
    }
  }
};
// exports.add_profie_image = async (req, res) => {
//   const buffer = Buffer.from(req.body.profile, "base64");
//   fs.writeFileSync(`public/${Date.now()}.jpg`, buffer);

//   const folder = "profile";
//   const fileName = `${folder}/${Date.now()}`;
//   const fileUpload = bucket.file(fileName);
//   const blobStream = fileUpload.createWriteStream({
//     metadata: {
//       contentType: ".jpg",
//     },
//   });

//   //const image_url = "https://project-micro.herokuapp.com/profile.jpg";
//   // const res_img = await fetch(image_url);
//   // const blob = await res_img.buffer();
//   // const uploadedImage = await s3
//   //   .upload({
//   //     Bucket: process.env.AWS_S3_BUCKET_NAME,
//   //     Key: req.files[0].originalFilename,
//   //     Body: blob,
//   //   })
//   //   .promise();
//};

exports.get_profile = (req, res) => {
  user
    .findById(req.params.user_id)
    .populate("posts")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};

exports.change_profile = (req, res) => {
  user.findOneAndUpdate(
    req.params.user_id,
    { picture: req.body.picture },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

exports.add_favourite = async (req, res) => {
  const current_user = await user.findById(req.params.user_id);
  if (current_user.favourite.includes(req.params.post_id) == false) {
    user.findByIdAndUpdate(
      req.params.user_id,
      {
        $push: {
          favourite: req.params.post_id,
        },
      },
      { new: true },
      (err, user) => {
        if (err) res.send(err);
        res.json(user);
      }
    );
    // .populate("favourite")
    // .exec(function (err, user) {
    //   if (err) res.send(err);
    //   res.json(user);
    // });
  } else {
    user.findByIdAndUpdate(
      req.params.user_id,
      {
        $pull: {
          favourite: req.params.post_id,
        },
      },
      { new: true },
      (err, user) => {
        if (err) res.send(err);
        res.json(user);
      }
    );
    // .populate("favourite")
    // .exec(function (err, user) {
    //   if (err) res.send(err);
    //   res.json(user);
    // });
  }
};

exports.get_favourite = (req, res) => {
  user
    .findById(req.params.user_id)
    .populate("favourite")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};
