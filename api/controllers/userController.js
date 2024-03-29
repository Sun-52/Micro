const mongoose = require("mongoose");
const user = mongoose.model("user");
const bcrypt = require("bcrypt");

exports.signIn = async (req, res) => {
  const current_user = await user.findOne({ email: req.body.email });
  if (current_user == null) {
    res.json({ type: "no user found" });
  } else {
    try {
      if (await bcrypt.compare(req.body.password, current_user.password)) {
        res.json(current_user);
      } else {
        res.json({ type: "password incorrect" });
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
};

exports.getProfile = (req, res) => {
  user
    .findById(req.params.user_id)
    .populate("posts")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};

exports.addFavourite = async (req, res) => {
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
  }
};

exports.getFavourite = (req, res) => {
  user
    .findById(req.params.user_id)
    .populate("favourite")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};

exports.changeName = (req, res) => {
  user.findByIdAndUpdate(
    req.params.user_id,
    { name: req.body.name },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};
