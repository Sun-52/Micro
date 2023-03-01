const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  content: {
    type: String,
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
