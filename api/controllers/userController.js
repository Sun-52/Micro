const mongoose = require("mongoose");
const user = mongoose.model("user");
const bcrypt = require("bcrypt");

exports.sign_in = async (req, res) => {
  console.log(req.body);
  const current_user = await user.findOne({ email: req.body.email });
  console.log(current_user, "requesting sign in user");
  if (current_user == null) {
    res.json({ type: "no user found" });
  } else {
    try {
      if (await bcrypt.compare(req.body.password, current_user.password)) {
        res.json(current_user);
      } else {
        res.json({ type: "password incorrect" });
      }
    } catch (e) {
      console.log(e, "catch error");
      res.status(500).send(e);
    }
  }
};

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

exports.get_favourite = (req, res) => {
  user
    .findById(req.params.user_id)
    .populate("favourite")
    .exec(function (err, user) {
      if (err) res.send(err);
      res.json(user);
    });
};
