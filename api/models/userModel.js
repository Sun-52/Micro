const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  // profile: {
  //   type: String,
  // },
  profile_image: {
    type: String,
  },
  password: {
    type: String,
  },
  // googleId: {
  //   type: Schema.Types.ObjectId,
  // },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
  ],
  posts_count: {
    type: Number,
  },
  favourite: [
    {
      type: Schema.Types.ObjectId,
      ref: "post",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
