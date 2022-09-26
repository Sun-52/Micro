const mongoose = require("mongoose");
const post = mongoose.model("post");
const user = mongoose.model("user");
const comment = mongoose.model("comment");
//function/controller

exports.publish = (req, res) => {
  const newPost = new post(req.body);
  newPost.category = req.body.category.split(",");
  console.log(newPost);
  console.log(req.body);
  //newPost.update({ date: Date() });
  newPost.save((err, post) => {
    if (err) res.send(err);
    user.findByIdAndUpdate(
      newPost.user,
      {
        $addToSet: {
          posts: newPost._id,
        },
      },
      { new: true },
      (err, user) => {
        if (err) res.send(err);
        //res.json(user);
        console.log("post added to user");
      }
    );
    res.json(post);
  });
};

exports.view_post = (req, res) => {
  post
    .findById({ _id: req.params.id })
    .populate("comments")
    .exec(function (err, post) {
      if (err) res.send(err);
      res.json(post);
    });
};

exports.post_comment = (req, res) => {
  const newComment = new comment(req.body);
  newComment.save((err, comment) => {
    if (err) res.send(err);
    post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          comments: newComment._id,
        },
      },
      { new: true },
      (err, post) => {
        if (err) res.send(err);
        //res.json(post);
        console.log("comment added");
      }
    );
    res.json(comment);
  });
};

exports.like = async (req, res) => {
  const current_post = await post.findById(req.params.id);
  if (current_post.liked_user.includes(req.params.user_id) == true) {
    post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          liked_user: req.params.user_id,
        },
        like: current_post.like - 1,
      },
      { new: true },
      (err, post) => {
        if (err) res.send(err);
        res.send(post);
      }
    );
  } else if (current_post.liked_user.includes(req.params.user_id) == false) {
    post.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          liked_user: req.params.user_id,
        },
        like: current_post.like + 1,
      },
      { new: true },
      (err, post) => {
        if (err) res.send(err);
        res.send(post);
      }
    );
  }
};

// exports.dislike = async (req, res) => {
//   const current_post = await post.findById(req.params.id);
//   dislike_process = () => {
//     if (current_post.disliked_user.includes(req.params.user_id) == true) {
//       post.findByIdAndUpdate(
//         req.params.id,
//         {
//           $pull: {
//             disliked_user: req.params.user_id,
//           },
//           dislike: current_post.dislike - 1,
//         },
//         { new: true },
//         (err, post) => {
//           if (err) res.send(err);
//           console.log("un-disliked");
//         }
//       );
//     } else if (
//       current_post.disliked_user.includes(req.params.user_id) == false
//     ) {
//       post.findByIdAndUpdate(
//         req.params.id,
//         {
//           $push: {
//             disliked_user: req.params.user_id,
//           },
//           dislike: current_post.dislike + 1,
//         },
//         { new: true },
//         (err, post) => {
//           if (err) res.send(err);
//           console.log("disliked");
//         }
//       );
//     }
//   };
//   if (current_post.liked_user.includes(req.params.user_id) == true) {
//     post.findByIdAndUpdate(
//       req.params.id,
//       {
//         $pull: {
//           liked_user: req.params.user_id,
//         },
//         like: current_post.like - 1,
//       },
//       { new: true },
//       (err, post) => {
//         if (err) res.send(err);
//         res.send(post);
//       }
//     );
//     dislike_process();
//   } else {
//     dislike_process();
//   }
// };

exports.add_favourite = async (req, res) => {
  const current_user = await user.findById(req.params.user_id);
  if (current_user.favourite.includes(req.params.id) == false) {
    user.findByIdAndUpdate(
      req.params.user_id,
      {
        $push: {
          favourite: req.params.id,
        },
      },
      { new: true },
      (err, user) => {
        if (err) res.send(err);
        res.send(user);
      }
    );
  } else {
    user.findByIdAndUpdate(
      req.params.user_id,
      {
        $pull: {
          favourite: req.params.id,
        },
      },
      { new: true },
      (err, user) => {
        if (err) res.send(err);
        res.send(user);
      }
    );
  }
};
exports.get_all_post = (req, res) => {
  post.find({}, (err, post) => {
    if (err) res.send(err);
    res.json(post);
  });
};

// exports.filter_post = (req, res) => {
//   console.log(req.query.category.split(","));
//   post.find(
//     { category: { $all: [req.query.category.split(",")] } },
//     (err, post) => {
//       if (err) res.send(err);
//       res.json(post);
//     }
//   );
// };

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
