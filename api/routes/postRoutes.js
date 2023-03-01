const taskBuilder = require("../controllers/postController.js");

module.exports = (app) => {
  app.route("/post").get(taskBuilder.get_all_post);
  app.route("/post/category").get(taskBuilder.get_post_by_category);
  app.route("/post/search").get(taskBuilder.search);
  app
    .route("/post/:post_id")
    .get(taskBuilder.view_post)
    .post(taskBuilder.post_comment);
  app.route("/post/:post_id/:user_id").patch(taskBuilder.like);
};
