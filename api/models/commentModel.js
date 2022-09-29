const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: String,
  },
  content: {
    type: String,
    required: "content cannot be blank",
  },
});

module.exports = mongoose.model("comment", commentSchema);
