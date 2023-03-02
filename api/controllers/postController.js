const mongoose = require("mongoose");
const date = require("date-and-time");
const post = mongoose.model("post");
const comment = mongoose.model("comment");
const user = mongoose.model("user");

exports.viewPost = async (req, res) => {
  const viewing_post = await post.findById(req.params.post_id);
  const view = viewing_post.view;

  viewing_post.view = view + 1;
  await viewing_post.save();
  post
    .findById(req.params.post_id)
    .populate({
      path: "comments",
      populate: {
        path: "user",
        model: "user",
      },
    })
    .populate("user")
    .exec(function (err, post) {
      if (err) res.send(err);
      res.json(post);
    });
};

exports.postComment = (req, res) => {
  const newComment = new comment(req.body);
  newComment.date = date.format(new Date(), "YYYY/MM/DD");
  newComment.save((err, comment) => {
    if (err) res.send(err);
    post.findByIdAndUpdate(
      req.params.post_id,
      {
        $addToSet: {
          comments: newComment._id,
        },
      },
      { new: true },
      (err, post) => {
        if (err) res.send(err);
        res.json(post);
      }
    );
  });
};

exports.like = async (req, res) => {
  const current_post = await post.findById(req.params.post_id);
  if (current_post.liked_user.includes(req.params.user_id) == true) {
    post
      .findByIdAndUpdate(
        req.params.post_id,
        {
          $pull: {
            liked_user: req.params.user_id,
          },
          like: current_post.like - 1,
        },
        { new: true }
      )
      .populate("user")
      .exec(function (err, post) {
        if (err) res.send(err);
        res.json(post);
      });
  } else if (current_post.liked_user.includes(req.params.user_id) == false) {
    post
      .findByIdAndUpdate(
        req.params.post_id,
        {
          $push: {
            liked_user: req.params.user_id,
          },
          like: current_post.like + 1,
        },
        { new: true }
      )
      .populate("user")
      .exec(function (err, post) {
        if (err) res.send(err);
        res.json(post);
      });
  }
};

exports.getallPost = (req, res) => {
  post.find({}, (err, post) => {
    if (err) res.send(err);
    res.json(post);
  });
};

exports.search = (req, res) => {
  post.find(
    {
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
      ],
    },
    (err, post) => {
      if (err) res.send(err);
      res.json(post);
    }
  );
};

exports.deletePost = (req, res) => {
  post.findByIdAndDelete(req.params.post_id, (err, post) => {
    if (err) res.send(err);
    comment.deleteMany(
      {
        _id: {
          $in: post.comments,
        },
      },
      (err, comment) => {
        if (err) res.send(err);
        user.findOneAndUpdate(
          { $or: [{ posts: post._id }, { favourite: post._id }] },
          { $pull: { posts: post._id, favourite: post._id } },
          (err, user) => {
            if (err) res.send(err);
          }
        );
      }
    );
    res.json(post);
  });
};
