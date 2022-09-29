const Joi = require("joi");
const mongoose = require("mongoose");
const user = mongoose.model("user");
//function/controller

exports.sign_in = async (req, res) => {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  let userInfoResponse = await fetch(
    "https://www.googleapis.com/userinfo/v2/me",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  let _userInfo = await userInfoResponse.json();
  // TODO use token and check in server
  _userInfo = {
    name: _userInfo.name,
    email: _userInfo.email,
    picture: _userInfo.picture,
    googleId: _userInfo.id,
    provider: "google",
  };
  user.findOne({ googleId: _userInfo.googleId }, (err, user) => {
    if (err) {
      res.send(err);
    } else if (null) {
      newUser = new user(_userInfo);
      newUser.save((err, user) => {
        if (err) res.send(err);
        res.json(user);
      });
    } else {
      res.send(_userInfo);
    }
  });
};

exports.get_profile = async (req, res) => {
  user
    .findById(req.params.id)
    .populate("posts")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};

exports.change_profile = (req, res) => {
  user.findOneAndUpdate(
    req.params.id,
    { picture: req.body.picture },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

exports.get_favourite = (req, res) => {
  user
    .findById(req.params.id)
    .populate("favourite")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};
