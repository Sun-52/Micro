const taskBuilder = require("../controllers/postController.js");

module.exports = (app) => {
  app.route("/post").post(taskBuilder.publish).get(taskBuilder.get_all_post);
  //app.route("/post/filter").get(taskBuilder.filter_post);
  app.route("/post/search").get(taskBuilder.search);
  app
    .route("/post/:id")
    .get(taskBuilder.view_post)
    .post(taskBuilder.post_comment);
  app
    .route("/post/:id/:user_id")
    .patch(taskBuilder.like)
    .post(taskBuilder.add_favourite);
};
