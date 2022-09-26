const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: "title cannot be blank",
  },
  image: [
    {
      type: Number,
    },
  ],
  content: {
    type: String,
    required: "content cannot be blank",
  },
  category: [
    {
      type: String,
    },
  ],
  date: {
    type: String,
  },
  view: {
    type: Number,
  },
  like: {
    type: Number,
  },
  liked_user: [
    {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  // dislike: {
  //   type: Number,
  // },
  // disliked_user: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "user",
  //   },
  // ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("post", postSchema);
