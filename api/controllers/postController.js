const mongoose = require("mongoose");
const date = require("date-and-time");
const post = mongoose.model("post");
const user = mongoose.model("user");
const comment = mongoose.model("comment");
//function/controller

// exports.publish = (req, res) => {
//   const newPost = new post(req.body);
//   newPost.category = req.body.category.split(",");
//   newPost.date = date.format(new Date(), "YYYY/MM/DD");
//   console.log(newPost);
//   console.log(req.body);
//   newPost.save((err, post) => {
//     if (err) res.send(err);
//     user.findByIdAndUpdate(
//       newPost.user,
//       {
//         $addToSet: {
//           posts: newPost._id,
//         },
//       },
//       { new: true },
//       (err, user) => {
//         if (err) res.send(err);
//         console.log("post added to user");
//       }
//     );
//     res.json(post);
//   });
// };

exports.view_post = async (req, res) => {
  const viewing_post = await post.findById(req.params.post_id);
  const view = viewing_post.view;

  viewing_post.view = view + 1;
  await viewing_post.save();
  post
    .findById(req.params.post_id)
    .populate("comments")
    .exec(function (err, post) {
      if (err) res.send(err);
      res.json(post);
    });
};

exports.post_comment = (req, res) => {
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
        //res.json(post);
        console.log("comment added");
      }
    );
    res.json(comment);
  });
};

exports.like = async (req, res) => {
  const current_post = await post.findById(req.params.post_id);
  if (current_post.liked_user.includes(req.params.user_id) == true) {
    post.findByIdAndUpdate(
      req.params.post_id,
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
      req.params.post_id,
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
//   const current_post = await post.findById(req.params.post_id);
//   dislike_process = () => {
//     if (current_post.disliked_user.includes(req.params.user_id) == true) {
//       post.findByIdAndUpdate(
//         req.params.post_id,
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
//         req.params.post_id,
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
//       req.params.post_id,
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

exports.get_all_post = (req, res) => {
  post.find({}, (err, post) => {
    if (err) res.send(err);
    res.json(post);
  });
};

exports.get_post_by_category = (req, res) => {
  post.find({ category: req.query.category }, (err, post) => {
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
