const taskBuilder = require("../controllers/postController.js");

module.exports = (app) => {
  app.route("/post").get(taskBuilder.getallPost);
  app.route("/post/category").get(taskBuilder.getCategory);
  app.route("/post/search").get(taskBuilder.search);
  app
    .route("/post/:post_id")
    .get(taskBuilder.viewPost)
    .post(taskBuilder.postComment)
    .delete(taskBuilder.deletePost);
  app.route("/post/comment/:post_id").get(taskBuilder.getComment);
  app.route("/post/:post_id/:user_id").patch(taskBuilder.like);
};
